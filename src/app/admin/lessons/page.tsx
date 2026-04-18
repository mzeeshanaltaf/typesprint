import { asc } from "drizzle-orm";

import { Card, CardContent } from "@/components/ui/card";
import { LessonsManager } from "@/components/admin/lessons-manager";
import { db } from "@/lib/db";
import { lesson } from "@/db/schema";

export default async function AdminLessonsPage() {
  const rows = await db
    .select()
    .from(lesson)
    .orderBy(asc(lesson.level), asc(lesson.orderIndex));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-semibold tracking-tight">Lessons</h2>
        <p className="text-sm text-muted-foreground">
          Create, edit, or remove typing lessons. Changes are visible on{" "}
          <code className="rounded bg-muted px-1 text-xs">/lessons</code>{" "}
          immediately.
        </p>
      </div>
      <Card className="border-border/60 bg-card/60">
        <CardContent className="p-6">
          <LessonsManager lessons={rows} />
        </CardContent>
      </Card>
    </div>
  );
}
