import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { headers } from "next/headers";
import { and, desc, eq } from "drizzle-orm";
import { ArrowLeft, Sparkles } from "lucide-react";

import { PublicPageLayout } from "@/components/layout/public-page-layout";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { LessonClient } from "@/components/typing/lesson-client";
import { SessionsTable } from "@/components/dashboard/sessions-table";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { lesson, typingSession } from "@/db/schema";

const CATEGORY_LABEL: Record<string, string> = {
  home_row: "Home row",
  numbers: "Numbers",
  symbols: "Symbols",
  paragraph: "Paragraph",
  coding: "Coding",
  mixed: "Mixed",
};

type Params = { id: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { id } = await params;
  const rows = await db.select().from(lesson).where(eq(lesson.id, id)).limit(1);
  const l = rows[0];
  if (!l) return { title: "AI Lesson" };
  return {
    title: l.title,
    description: `AI-generated typing lesson: ${l.title}`,
  };
}

export default async function AiLessonPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { id } = await params;

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect(`/sign-in?redirect=/ai-lessons/${id}`);

  const rows = await db.select().from(lesson).where(eq(lesson.id, id)).limit(1);
  const l = rows[0];
  if (!l) notFound();
  if (l.source !== "ai" || l.userId !== session.user.id) notFound();

  const historyRows = await db
    .select({
      id: typingSession.id,
      mode: typingSession.mode,
      wpm: typingSession.wpm,
      accuracy: typingSession.accuracy,
      mistakes: typingSession.mistakes,
      durationSec: typingSession.durationSec,
      createdAt: typingSession.createdAt,
    })
    .from(typingSession)
    .where(
      and(
        eq(typingSession.userId, session.user.id),
        eq(typingSession.lessonId, l.id),
      ),
    )
    .orderBy(desc(typingSession.createdAt));

  const history = historyRows.map((r) => ({
    ...r,
    createdAt: r.createdAt.toISOString(),
    lessonTitle: null,
  }));

  const bestWpm = history.reduce((m, r) => Math.max(m, r.wpm), 0);
  const bestAccuracy = history.reduce((m, r) => Math.max(m, r.accuracy), 0);
  const attempts = history.length;

  return (
    <PublicPageLayout>
      <div className="mx-auto w-full max-w-4xl px-4 py-12 md:px-6 md:py-16">
        <Link
          href="/ai-lessons"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          All AI lessons
        </Link>

        <header className="mb-8 flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="gap-1">
              <Sparkles className="size-3" />
              AI
            </Badge>
            <Badge variant="secondary" className="capitalize">
              {l.level}
            </Badge>
            <Badge variant="secondary">
              {CATEGORY_LABEL[l.category] ?? l.category}
            </Badge>
            {l.language && (
              <Badge variant="secondary" className="capitalize">
                {l.language}
              </Badge>
            )}
          </div>
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            {l.title}
          </h1>
          {l.topic && (
            <p className="text-sm text-muted-foreground">Topic · {l.topic}</p>
          )}
          <p className="text-muted-foreground">
            Type the text below. Timer starts on your first keystroke and stops
            when you finish.
          </p>
        </header>

        <LessonClient
          lessonId={l.id}
          content={l.content}
          mode="ai_lesson"
        />

        <section className="mt-12 flex flex-col gap-4">
          <div className="flex items-end justify-between gap-3">
            <div className="flex flex-col gap-1">
              <h2 className="text-xl font-semibold tracking-tight">
                Your attempts
              </h2>
              <p className="text-sm text-muted-foreground">
                Every time you complete this lesson it shows up here.
              </p>
            </div>
            {attempts > 0 && (
              <div className="hidden gap-6 text-right md:flex">
                <div className="flex flex-col">
                  <span className="text-xs uppercase tracking-wider text-muted-foreground">
                    Attempts
                  </span>
                  <span className="font-mono text-lg font-semibold">
                    {attempts}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs uppercase tracking-wider text-muted-foreground">
                    Best WPM
                  </span>
                  <span className="font-mono text-lg font-semibold">
                    {bestWpm}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs uppercase tracking-wider text-muted-foreground">
                    Best Acc
                  </span>
                  <span className="font-mono text-lg font-semibold">
                    {bestAccuracy}%
                  </span>
                </div>
              </div>
            )}
          </div>

          <Card className="border-border/60 bg-card/60 backdrop-blur">
            <CardContent className="p-0">
              <SessionsTable
                sessions={history}
                showMode={false}
                emptyMessage="No attempts yet — finish a run above and it'll appear here."
              />
            </CardContent>
          </Card>
        </section>
      </div>
    </PublicPageLayout>
  );
}
