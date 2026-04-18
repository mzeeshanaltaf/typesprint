"use server";

import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireAdmin } from "@/lib/admin";
import { db } from "@/lib/db";
import { lesson, user } from "@/db/schema";

const LESSON_LEVELS = ["beginner", "intermediate", "advanced"] as const;
const LESSON_CATEGORIES = [
  "home_row",
  "numbers",
  "symbols",
  "paragraph",
  "coding",
] as const;

const LessonSchema = z.object({
  level: z.enum(LESSON_LEVELS),
  category: z.enum(LESSON_CATEGORIES),
  title: z.string().min(1).max(200),
  content: z.string().min(1).max(10_000),
  orderIndex: z.coerce.number().int().min(0).max(10_000),
});

function parseLessonForm(data: FormData) {
  return LessonSchema.safeParse({
    level: data.get("level"),
    category: data.get("category"),
    title: data.get("title"),
    content: data.get("content"),
    orderIndex: data.get("orderIndex") ?? 0,
  });
}

export type ActionResult =
  | { ok: true }
  | { ok: false; error: string };

export async function createLesson(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  await requireAdmin();
  const parsed = parseLessonForm(formData);
  if (!parsed.success) {
    return { ok: false, error: "Invalid input. Check all fields." };
  }
  await db.insert(lesson).values({
    id: randomUUID(),
    ...parsed.data,
  });
  revalidatePath("/admin/lessons");
  revalidatePath("/lessons");
  return { ok: true };
}

export async function updateLesson(
  id: string,
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  await requireAdmin();
  const parsed = parseLessonForm(formData);
  if (!parsed.success) {
    return { ok: false, error: "Invalid input. Check all fields." };
  }
  await db.update(lesson).set(parsed.data).where(eq(lesson.id, id));
  revalidatePath("/admin/lessons");
  revalidatePath("/lessons");
  revalidatePath(`/lessons/${id}`);
  return { ok: true };
}

export async function deleteLesson(id: string): Promise<ActionResult> {
  await requireAdmin();
  await db.delete(lesson).where(eq(lesson.id, id));
  revalidatePath("/admin/lessons");
  revalidatePath("/lessons");
  return { ok: true };
}

const ToggleRoleSchema = z.object({
  userId: z.string().min(1),
  role: z.enum(["user", "admin"]),
});

export async function setUserRole(
  userId: string,
  role: "user" | "admin",
): Promise<ActionResult> {
  const session = await requireAdmin();
  const parsed = ToggleRoleSchema.safeParse({ userId, role });
  if (!parsed.success) return { ok: false, error: "Invalid input." };
  if (userId === session.user.id && role !== "admin") {
    return { ok: false, error: "You cannot remove your own admin role." };
  }
  await db.update(user).set({ role }).where(eq(user.id, userId));
  revalidatePath("/admin/users");
  return { ok: true };
}
