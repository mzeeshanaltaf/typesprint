import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { and, desc, eq } from "drizzle-orm";
import { Sparkles } from "lucide-react";

import { PublicPageLayout } from "@/components/layout/public-page-layout";
import { GenerateForm } from "@/components/ai-lessons/generate-form";
import {
  AiLessonCard,
  type AiLessonCardData,
} from "@/components/ai-lessons/ai-lesson-card";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { lesson } from "@/db/schema";

export const metadata: Metadata = {
  title: "AI Lessons",
  description:
    "Generate personalized typing lessons with AI — pick a level, type, length, and topic.",
};

export default async function AiLessonsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/sign-in?redirect=/ai-lessons");

  const rows = await db
    .select({
      id: lesson.id,
      title: lesson.title,
      level: lesson.level,
      category: lesson.category,
      topic: lesson.topic,
      language: lesson.language,
      content: lesson.content,
      createdAt: lesson.createdAt,
    })
    .from(lesson)
    .where(and(eq(lesson.source, "ai"), eq(lesson.userId, session.user.id)))
    .orderBy(desc(lesson.createdAt));

  const lessons: AiLessonCardData[] = rows.map((r) => ({
    ...r,
    createdAt: r.createdAt.toISOString(),
  }));

  return (
    <PublicPageLayout>
      <div className="mx-auto w-full max-w-6xl px-4 py-12 md:px-6 md:py-16">
        <header className="mb-10 flex flex-col gap-3">
          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            <Sparkles className="size-3.5" />
            AI Lessons
          </p>
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Practice on text the AI writes for you
          </h1>
          <p className="max-w-2xl text-muted-foreground md:text-lg">
            Choose a difficulty, lesson type, and length — optionally a topic —
            and we&apos;ll generate fresh practice text. Every lesson is saved
            so you can come back and improve your time.
          </p>
        </header>

        <section className="mb-14 flex flex-col gap-4">
          <h2 className="text-xl font-semibold tracking-tight">Generate</h2>
          <GenerateForm />
        </section>

        <section className="flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold tracking-tight">
              Your AI lessons
            </h2>
            {lessons.length > 0 && (
              <span className="text-sm text-muted-foreground">
                {lessons.length} {lessons.length === 1 ? "lesson" : "lessons"}
              </span>
            )}
          </div>

          {lessons.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border/60 bg-card/30 p-10 text-center">
              <p className="text-sm text-muted-foreground">
                No AI lessons yet. Generate your first one above.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {lessons.map((l) => (
                <AiLessonCard key={l.id} lesson={l} />
              ))}
            </div>
          )}
        </section>
      </div>
    </PublicPageLayout>
  );
}
