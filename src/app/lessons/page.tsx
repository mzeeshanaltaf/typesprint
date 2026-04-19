import type { Metadata } from "next";
import Link from "next/link";
import { asc } from "drizzle-orm";

import { AppNavbar } from "@/components/layout/app-navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { db } from "@/lib/db";
import { lesson } from "@/db/schema";

export const metadata: Metadata = {
  title: "Lessons",
  description:
    "Structured typing lessons grouped by level — beginner, intermediate, and advanced.",
};

const LEVEL_ORDER = ["beginner", "intermediate", "advanced"] as const;
type Level = (typeof LEVEL_ORDER)[number];

const LEVEL_COPY: Record<Level, { label: string; description: string }> = {
  beginner: {
    label: "Beginner",
    description: "Home row, simple words, and your first full sentences.",
  },
  intermediate: {
    label: "Intermediate",
    description: "Numbers, symbols, and longer paragraphs.",
  },
  advanced: {
    label: "Advanced",
    description: "Literary passages, technical writing, and code snippets.",
  },
};

const CATEGORY_LABEL: Record<string, string> = {
  home_row: "Home row",
  numbers: "Numbers",
  symbols: "Symbols",
  paragraph: "Paragraph",
  coding: "Coding",
};

export default async function LessonsPage() {
  const all = await db
    .select()
    .from(lesson)
    .orderBy(asc(lesson.orderIndex));

  const grouped = LEVEL_ORDER.reduce<Record<Level, typeof all>>(
    (acc, level) => {
      acc[level] = all.filter((l) => l.level === level);
      return acc;
    },
    { beginner: [], intermediate: [], advanced: [] },
  );

  return (
    <div className="flex min-h-svh flex-col">
      <AppNavbar />
      <main className="flex-1">
        <div className="mx-auto w-full max-w-6xl px-4 py-12 md:px-6 md:py-16">
          <header className="mb-12 flex flex-col gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Lessons
            </p>
            <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
              A structured path from home row to code
            </h1>
            <p className="max-w-2xl text-muted-foreground md:text-lg">
              Short focused lessons grouped by level. Pick one, type the text,
              see your results. Progress saves automatically when signed in.
            </p>
          </header>

          <div className="flex flex-col gap-14">
            {LEVEL_ORDER.map((level) => {
              const items = grouped[level];
              if (items.length === 0) return null;
              return (
                <section key={level} className="flex flex-col gap-5">
                  <div className="flex flex-col gap-1">
                    <h2 className="text-2xl font-semibold tracking-tight">
                      {LEVEL_COPY[level].label}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {LEVEL_COPY[level].description}
                    </p>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {items.map((l) => (
                      <Link
                        key={l.id}
                        href={`/lessons/${l.id}`}
                        className="group"
                      >
                        <Card className="h-full border-border/60 bg-card/60 backdrop-blur transition-colors hover:border-border hover:bg-card/80">
                          <CardContent className="flex h-full flex-col gap-3 p-6">
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className="text-xs">
                                {CATEGORY_LABEL[l.category] ?? l.category}
                              </Badge>
                            </div>
                            <h3 className="text-lg font-semibold group-hover:text-foreground">
                              {l.title}
                            </h3>
                            <p className="line-clamp-3 text-sm text-muted-foreground">
                              {l.content}
                            </p>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>

          {all.length === 0 && (
            <p className="text-muted-foreground">
              No lessons yet — run{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
                npm run db:seed
              </code>{" "}
              to populate.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
