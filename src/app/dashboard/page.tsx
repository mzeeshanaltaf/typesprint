import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { desc, eq, sql } from "drizzle-orm";
import { Clock, Flame, Gauge, Trophy } from "lucide-react";

import { AppNavbar } from "@/components/layout/app-navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DashboardCharts } from "@/components/dashboard/dashboard-charts";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { dailyStat, streak, typingSession, lesson } from "@/db/schema";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your typing progress — WPM trends, streak, and recent sessions.",
};

function formatDuration(totalSec: number): string {
  if (totalSec < 60) return `${totalSec}s`;
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return s > 0 ? `${m}m ${s}s` : `${m}m`;
}

function formatDate(d: Date | string): string {
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

function formatTime(d: Date | string): string {
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/sign-in?callbackUrl=/dashboard");
  const userId = session.user.id;

  // 30 days ago, midnight UTC
  const since = new Date();
  since.setUTCHours(0, 0, 0, 0);
  since.setUTCDate(since.getUTCDate() - 29);
  const sinceDay = since.toISOString().slice(0, 10);
  const today = new Date().toISOString().slice(0, 10);

  const [dailyRows, streakRow, recentSessions, aggregates] = await Promise.all([
    db
      .select()
      .from(dailyStat)
      .where(
        sql`${dailyStat.userId} = ${userId} AND ${dailyStat.day} >= ${sinceDay}`,
      )
      .orderBy(dailyStat.day),
    db.select().from(streak).where(eq(streak.userId, userId)).limit(1),
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
      .limit(10),
    db
      .select({
        bestWpm: sql<number>`COALESCE(MAX(${typingSession.wpm}), 0)`,
        avgWpm: sql<number>`COALESCE(ROUND(AVG(${typingSession.wpm}))::int, 0)`,
        avgAccuracy: sql<number>`COALESCE(ROUND(AVG(${typingSession.accuracy}))::int, 0)`,
        totalSessions: sql<number>`COUNT(*)::int`,
      })
      .from(typingSession)
      .where(eq(typingSession.userId, userId)),
  ]);

  const todayStat = dailyRows.find((r) => r.day === today);
  const agg = aggregates[0] ?? {
    bestWpm: 0,
    avgWpm: 0,
    avgAccuracy: 0,
    totalSessions: 0,
  };

  // Fill missing days with zeros for chart continuity
  const series = fillDailySeries(dailyRows, sinceDay, today);

  return (
    <div className="flex min-h-svh flex-col">
      <AppNavbar />
      <main className="flex-1">
        <div className="mx-auto w-full max-w-6xl px-4 py-12 md:px-6 md:py-16">
          <header className="mb-10 flex flex-col gap-2">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Dashboard
            </p>
            <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
              Welcome back, {session.user.name?.split(" ")[0] ?? "typist"}
            </h1>
            <p className="text-muted-foreground">
              Your typing progress over the last 30 days.
            </p>
          </header>

          <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Kpi
              icon={<Trophy className="size-4" />}
              label="Best WPM"
              value={agg.bestWpm}
              hint={agg.totalSessions > 0 ? "all-time personal best" : "no sessions yet"}
            />
            <Kpi
              icon={<Gauge className="size-4" />}
              label="Avg WPM"
              value={agg.avgWpm}
              hint={`${agg.avgAccuracy}% avg accuracy`}
            />
            <Kpi
              icon={<Clock className="size-4" />}
              label="Practice today"
              value={formatDuration(todayStat?.practiceSeconds ?? 0)}
              hint={`${todayStat?.sessionsCount ?? 0} session${
                (todayStat?.sessionsCount ?? 0) === 1 ? "" : "s"
              }`}
            />
            <Kpi
              icon={<Flame className="size-4" />}
              label="Streak"
              value={`${streakRow[0]?.currentDays ?? 0}d`}
              hint={`longest ${streakRow[0]?.longestDays ?? 0}d`}
            />
          </div>

          <div className="mb-10">
            <Card className="border-border/60 bg-card/60 backdrop-blur">
              <CardContent className="p-6">
                <div className="mb-4 flex items-baseline justify-between">
                  <h2 className="text-lg font-semibold">Progress over time</h2>
                  <span className="text-xs text-muted-foreground">
                    Last 30 days
                  </span>
                </div>
                <DashboardCharts data={series} />
              </CardContent>
            </Card>
          </div>

          <Card className="border-border/60 bg-card/60 backdrop-blur">
            <CardContent className="p-0">
              <div className="flex items-baseline justify-between p-6 pb-4">
                <h2 className="text-lg font-semibold">Recent sessions</h2>
                <span className="text-xs text-muted-foreground">
                  Last {recentSessions.length}
                </span>
              </div>
              {recentSessions.length === 0 ? (
                <p className="px-6 pb-6 text-sm text-muted-foreground">
                  No sessions yet. Head to{" "}
                  <a className="text-indigo-500 hover:underline" href="/practice">
                    /practice
                  </a>{" "}
                  to run one.
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>When</TableHead>
                      <TableHead>Mode</TableHead>
                      <TableHead className="text-right">WPM</TableHead>
                      <TableHead className="text-right">Accuracy</TableHead>
                      <TableHead className="text-right">Mistakes</TableHead>
                      <TableHead className="text-right">Duration</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentSessions.map((s) => (
                      <TableRow key={s.id}>
                        <TableCell className="whitespace-nowrap">
                          <div className="flex flex-col">
                            <span>{formatDate(s.createdAt)}</span>
                            <span className="text-xs text-muted-foreground">
                              {formatTime(s.createdAt)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="capitalize">
                            {s.mode === "lesson" && s.lessonTitle
                              ? s.lessonTitle
                              : s.mode === "custom"
                                ? "Free"
                                : `${s.mode}s`}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-mono font-medium">
                          {s.wpm}
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          {s.accuracy}%
                        </TableCell>
                        <TableCell className="text-right font-mono text-muted-foreground">
                          {s.mistakes}
                        </TableCell>
                        <TableCell className="text-right font-mono text-muted-foreground">
                          {formatDuration(s.durationSec)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

function Kpi({
  icon,
  label,
  value,
  hint,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  hint: string;
}) {
  return (
    <Card className="border-border/60 bg-card/60 backdrop-blur">
      <CardContent className="flex flex-col gap-3 p-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {icon}
          <span>{label}</span>
        </div>
        <div className="font-mono text-3xl font-semibold tracking-tight">
          {value}
        </div>
        <div className="text-xs text-muted-foreground">{hint}</div>
      </CardContent>
    </Card>
  );
}

function fillDailySeries(
  rows: Array<{
    day: string;
    avgWpm: number;
    bestWpm: number;
    accuracyAvg: number;
    practiceSeconds: number;
  }>,
  sinceDay: string,
  todayDay: string,
) {
  const map = new Map(rows.map((r) => [r.day, r]));
  const out: Array<{
    day: string;
    label: string;
    avgWpm: number;
    bestWpm: number;
    accuracy: number;
  }> = [];
  const d = new Date(sinceDay + "T00:00:00Z");
  const end = new Date(todayDay + "T00:00:00Z");
  while (d <= end) {
    const key = d.toISOString().slice(0, 10);
    const row = map.get(key);
    out.push({
      day: key,
      label: formatDate(d),
      avgWpm: row?.avgWpm ?? 0,
      bestWpm: row?.bestWpm ?? 0,
      accuracy: row?.accuracyAvg ?? 0,
    });
    d.setUTCDate(d.getUTCDate() + 1);
  }
  return out;
}
