import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { ArrowLeft } from "lucide-react";

import { PublicPageLayout } from "@/components/layout/public-page-layout";
import { Badge } from "@/components/ui/badge";
import { LessonClient } from "@/components/typing/lesson-client";
import { db } from "@/lib/db";
import { lesson } from "@/db/schema";

const CATEGORY_LABEL: Record<string, string> = {
  home_row: "Home row",
  numbers: "Numbers",
  symbols: "Symbols",
  paragraph: "Paragraph",
  coding: "Coding",
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
  if (!l) return { title: "Lesson" };
  return {
    title: l.title,
    description: `Typing lesson: ${l.title}`,
  };
}

export default async function LessonPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { id } = await params;
  const rows = await db.select().from(lesson).where(eq(lesson.id, id)).limit(1);
  const l = rows[0];
  if (!l) notFound();

  return (
    <PublicPageLayout>
      <div className="mx-auto w-full max-w-4xl px-4 py-12 md:px-6 md:py-16">
          <Link
            href="/lessons"
            className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            All lessons
          </Link>

          <header className="mb-8 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="capitalize">
                {l.level}
              </Badge>
              <Badge variant="secondary">
                {CATEGORY_LABEL[l.category] ?? l.category}
              </Badge>
            </div>
            <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
              {l.title}
            </h1>
            <p className="text-muted-foreground">
              Type the text below. Timer starts on your first keystroke and
              stops when you finish.
            </p>
          </header>

          <LessonClient lessonId={l.id} content={l.content} />
      </div>
    </PublicPageLayout>
  );
}
