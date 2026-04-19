"use server";

import { headers } from "next/headers";
import { randomUUID } from "node:crypto";
import { updateTag } from "next/cache";
import { eq, sql } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { dailyStat, streak, typingSession } from "@/db/schema";

const InputSchema = z.object({
  mode: z.enum(["15", "30", "60", "custom", "lesson", "ai_lesson"]),
  durationSec: z.number().int().positive().max(60 * 60),
  wpm: z.number().int().min(0).max(500),
  accuracy: z.number().int().min(0).max(100),
  mistakes: z.number().int().min(0).max(10_000),
  charsTyped: z.number().int().min(0).max(100_000),
  lessonId: z.string().optional(),
});

export type SaveSessionInput = z.infer<typeof InputSchema>;

function dayKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function addDays(iso: string, days: number): string {
  const d = new Date(iso + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + days);
  return dayKey(d);
}

export async function saveSession(
  raw: SaveSessionInput,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return { ok: false, error: "Unauthenticated" };
  }

  const parsed = InputSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: "Invalid input" };
  }

  const input = parsed.data;
  const userId = session.user.id;
  const today = dayKey(new Date());

  await db.insert(typingSession).values({
    id: randomUUID(),
    userId,
    mode: input.mode,
    durationSec: input.durationSec,
    wpm: input.wpm,
    accuracy: input.accuracy,
    mistakes: input.mistakes,
    charsTyped: input.charsTyped,
    lessonId: input.lessonId ?? null,
  });

  await db
    .insert(dailyStat)
    .values({
      userId,
      day: today,
      practiceSeconds: input.durationSec,
      bestWpm: input.wpm,
      avgWpm: input.wpm,
      accuracyAvg: input.accuracy,
      sessionsCount: 1,
    })
    .onConflictDoUpdate({
      target: [dailyStat.userId, dailyStat.day],
      set: {
        practiceSeconds: sql`${dailyStat.practiceSeconds} + ${input.durationSec}`,
        bestWpm: sql`GREATEST(${dailyStat.bestWpm}, ${input.wpm})`,
        avgWpm: sql`((${dailyStat.avgWpm} * ${dailyStat.sessionsCount}) + ${input.wpm}) / (${dailyStat.sessionsCount} + 1)`,
        accuracyAvg: sql`((${dailyStat.accuracyAvg} * ${dailyStat.sessionsCount}) + ${input.accuracy}) / (${dailyStat.sessionsCount} + 1)`,
        sessionsCount: sql`${dailyStat.sessionsCount} + 1`,
      },
    });

  const existing = await db
    .select()
    .from(streak)
    .where(eq(streak.userId, userId))
    .limit(1);
  const prev = existing[0];

  if (!prev) {
    await db.insert(streak).values({
      userId,
      currentDays: 1,
      longestDays: 1,
      lastActiveDay: today,
    });
  } else if (prev.lastActiveDay === today) {
    // already counted today
  } else {
    const yesterday = addDays(today, -1);
    const current =
      prev.lastActiveDay === yesterday ? prev.currentDays + 1 : 1;
    const longest = Math.max(prev.longestDays, current);
    await db
      .update(streak)
      .set({
        currentDays: current,
        longestDays: longest,
        lastActiveDay: today,
      })
      .where(eq(streak.userId, userId));
  }

  // Eager invalidation: next read of any cached function tagged "typing-sessions"
  // will block-fetch fresh data (no stale-while-revalidate). Server Actions also
  // automatically invalidate the client-side Router Cache, so /dashboard,
  // /dashboard/sessions, and lesson detail pages reflect the new row on the very
  // next navigation — no refresh needed.
  updateTag("typing-sessions");

  return { ok: true };
}
