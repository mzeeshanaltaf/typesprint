import { sql } from "drizzle-orm";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/db";
import { typingSession, user, lesson } from "@/db/schema";
import { requireAdmin } from "@/lib/admin";

export default async function AdminAnalyticsPage() {
  await requireAdmin();

  const [userStats] = await db
    .select({
      total: sql<number>`count(*)::int`,
      last7: sql<number>`count(*) filter (where ${user.createdAt} >= now() - interval '7 days')::int`,
      last30: sql<number>`count(*) filter (where ${user.createdAt} >= now() - interval '30 days')::int`,
    })
    .from(user);

  const [sessionStats] = await db
    .select({
      total: sql<number>`count(*)::int`,
      last7: sql<number>`count(*) filter (where ${typingSession.createdAt} >= now() - interval '7 days')::int`,
      today: sql<number>`count(*) filter (where ${typingSession.createdAt} >= current_date)::int`,
      avgWpm: sql<number>`coalesce(round(avg(${typingSession.wpm}))::int, 0)`,
      bestWpm: sql<number>`coalesce(max(${typingSession.wpm}), 0)::int`,
      avgAccuracy: sql<number>`coalesce(round(avg(${typingSession.accuracy}))::int, 0)`,
      totalSeconds: sql<number>`coalesce(sum(${typingSession.durationSec}), 0)::int`,
    })
    .from(typingSession);

  const [{ total: lessonsTotal }] = await db
    .select({ total: sql<number>`count(*)::int` })
    .from(lesson);

  const perDay = await db
    .select({
      day: sql<string>`to_char(date_trunc('day', ${typingSession.createdAt}), 'YYYY-MM-DD')`,
      count: sql<number>`count(*)::int`,
      avgWpm: sql<number>`coalesce(round(avg(${typingSession.wpm}))::int, 0)`,
    })
    .from(typingSession)
    .where(sql`${typingSession.createdAt} >= now() - interval '14 days'`)
    .groupBy(sql`date_trunc('day', ${typingSession.createdAt})`)
    .orderBy(sql`date_trunc('day', ${typingSession.createdAt}) desc`);

  const totalHours = (sessionStats.totalSeconds / 3600).toFixed(1);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-semibold tracking-tight">Analytics</h2>
        <p className="text-sm text-muted-foreground">
          Platform-wide activity across all users.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi label="Total users" value={userStats.total.toLocaleString()} />
        <Kpi label="New (last 7d)" value={userStats.last7.toLocaleString()} />
        <Kpi label="Total sessions" value={sessionStats.total.toLocaleString()} />
        <Kpi label="Sessions today" value={sessionStats.today.toLocaleString()} />
        <Kpi label="Avg WPM" value={String(sessionStats.avgWpm)} />
        <Kpi label="Best WPM" value={String(sessionStats.bestWpm)} />
        <Kpi label="Avg accuracy" value={`${sessionStats.avgAccuracy}%`} />
        <Kpi label="Total hours practiced" value={totalHours} />
      </div>

      <Card className="border-border/60 bg-card/60">
        <CardHeader>
          <CardTitle>Last 14 days</CardTitle>
        </CardHeader>
        <CardContent>
          {perDay.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No sessions yet.
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {perDay.map((d) => (
                <div
                  key={d.day}
                  className="flex items-center justify-between rounded-md border border-border/60 px-3 py-2 text-sm"
                >
                  <span className="font-mono text-muted-foreground">
                    {d.day}
                  </span>
                  <div className="flex items-center gap-6">
                    <span>
                      <span className="text-muted-foreground">Sessions: </span>
                      <span className="font-medium">{d.count}</span>
                    </span>
                    <span>
                      <span className="text-muted-foreground">Avg WPM: </span>
                      <span className="font-medium">{d.avgWpm}</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground">
        {lessonsTotal} lessons currently in the library.
      </p>
    </div>
  );
}

function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <Card className="border-border/60 bg-card/60">
      <CardContent className="flex flex-col gap-1 p-6">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        <span className="text-2xl font-semibold tracking-tight">{value}</span>
      </CardContent>
    </Card>
  );
}
