import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { randomUUID } from "node:crypto";
import { revalidateTag } from "next/cache";
import { eq, sql } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { dailyStat, streak, typingSession } from "@/db/schema";

const BodySchema = z.object({
  mode: z.enum(["15", "30", "60", "custom", "lesson"]),
  durationSec: z.number().int().positive().max(60 * 60),
  wpm: z.number().int().min(0).max(500),
  accuracy: z.number().int().min(0).max(100),
  mistakes: z.number().int().min(0).max(10_000),
  charsTyped: z.number().int().min(0).max(100_000),
  lessonId: z.string().optional(),
});

function dayKey(d: Date): string {
  // YYYY-MM-DD in UTC
  return d.toISOString().slice(0, 10);
}

function addDays(iso: string, days: number): string {
  const d = new Date(iso + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + days);
  return dayKey(d);
}

export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid body", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const input = parsed.data;
  const userId = session.user.id;
  const today = dayKey(new Date());

  // 1) Insert the session row
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

  // 2) Upsert daily_stat — weighted rolling averages via sessionsCount
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

  // 3) Update streak
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

  revalidateTag("typing-sessions");

  return NextResponse.json({ ok: true });
}
