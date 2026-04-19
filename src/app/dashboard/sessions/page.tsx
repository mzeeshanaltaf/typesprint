import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { desc, eq, sql } from "drizzle-orm";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";

import { AppNavbar } from "@/components/layout/app-navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SessionsTable } from "@/components/dashboard/sessions-table";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { typingSession, lesson } from "@/db/schema";

export const metadata: Metadata = { title: "All sessions" };

const PAGE_SIZE = 25;

export default async function AllSessionsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/sign-in?callbackUrl=/dashboard/sessions");
  const userId = session.user.id;

  const { page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);
  const offset = (page - 1) * PAGE_SIZE;

  const [rows, [{ total }]] = await Promise.all([
    db
      .select({
        id: typingSession.id,
        mode: typingSession.mode,
        wpm: typingSession.wpm,
        accuracy: typingSession.accuracy,
        mistakes: typingSession.mistakes,
        durationSec: typingSession.durationSec,
        createdAt: typingSession.createdAt,
        lessonTitle: lesson.title,
      })
      .from(typingSession)
      .leftJoin(lesson, eq(typingSession.lessonId, lesson.id))
      .where(eq(typingSession.userId, userId))
      .orderBy(desc(typingSession.createdAt))
      .limit(PAGE_SIZE)
      .offset(offset),
    db
      .select({ total: sql<number>`count(*)::int` })
      .from(typingSession)
      .where(eq(typingSession.userId, userId)),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const sessions = rows.map((r) => ({
    ...r,
    createdAt: r.createdAt.toISOString(),
    lessonTitle: r.lessonTitle ?? null,
  }));

  return (
    <div className="flex min-h-svh flex-col">
      <AppNavbar />
      <main className="flex-1">
        <div className="mx-auto w-full max-w-6xl px-4 py-12 md:px-6 md:py-16">
          <Link
            href="/dashboard"
            className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Dashboard
          </Link>

          <header className="mb-8 flex flex-col gap-2">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              History
            </p>
            <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
              All sessions
            </h1>
            <p className="text-muted-foreground">
              {total} session{total === 1 ? "" : "s"} total
            </p>
          </header>

          <Card className="border-border/60 bg-card/60 backdrop-blur">
            <CardContent className="p-0">
              <SessionsTable sessions={sessions} />
            </CardContent>
          </Card>

          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-2">
              <Button
                asChild
                variant="outline"
                size="sm"
                disabled={page <= 1}
                className={page <= 1 ? "pointer-events-none opacity-50" : ""}
              >
                <Link href={`/dashboard/sessions?page=${page - 1}`}>
                  <ChevronLeft className="size-4" />
                  Previous
                </Link>
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </span>
              <Button
                asChild
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                className={
                  page >= totalPages ? "pointer-events-none opacity-50" : ""
                }
              >
                <Link href={`/dashboard/sessions?page=${page + 1}`}>
                  Next
                  <ChevronRight className="size-4" />
                </Link>
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
