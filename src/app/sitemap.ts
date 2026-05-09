import type { MetadataRoute } from "next";
import { asc, eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { lesson } from "@/db/schema";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/practice`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/lessons`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    { url: `${base}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  const lessons = await db
    .select({ id: lesson.id, createdAt: lesson.createdAt })
    .from(lesson)
    .where(eq(lesson.source, "seed"))
    .orderBy(asc(lesson.orderIndex));

  const lessonEntries: MetadataRoute.Sitemap = lessons.map((l) => ({
    url: `${base}/lessons/${l.id}`,
    lastModified: l.createdAt ?? now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticEntries, ...lessonEntries];
}
