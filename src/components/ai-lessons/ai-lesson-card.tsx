import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const CATEGORY_LABEL: Record<string, string> = {
  home_row: "Home row",
  numbers: "Numbers",
  symbols: "Symbols",
  paragraph: "Paragraph",
  coding: "Coding",
  mixed: "Mixed",
};

export type AiLessonCardData = {
  id: string;
  title: string;
  level: string;
  category: string;
  topic: string | null;
  language: string | null;
  content: string;
  createdAt: string; // ISO string
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function AiLessonCard({ lesson }: { lesson: AiLessonCardData }) {
  return (
    <Link href={`/ai-lessons/${lesson.id}`} className="group">
      <Card className="h-full border-border/60 bg-card/60 backdrop-blur transition-colors hover:border-border hover:bg-card/80">
        <CardContent className="flex h-full flex-col gap-3 p-6">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="capitalize">
              {lesson.level}
            </Badge>
            <Badge variant="secondary">
              {CATEGORY_LABEL[lesson.category] ?? lesson.category}
            </Badge>
            {lesson.language && (
              <Badge variant="secondary" className="capitalize">
                {lesson.language}
              </Badge>
            )}
          </div>
          <h3 className="text-lg font-semibold group-hover:text-foreground">
            {lesson.title}
          </h3>
          {lesson.topic && (
            <p className="text-xs text-muted-foreground">
              Topic · {lesson.topic}
            </p>
          )}
          <p className="line-clamp-3 text-sm text-muted-foreground">
            {lesson.content}
          </p>
          <p className="mt-auto text-xs text-muted-foreground">
            {formatDate(lesson.createdAt)}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
