"use client";

import dynamic from "next/dynamic";
import { useCallback } from "react";
import { toast } from "sonner";

import { Skeleton } from "@/components/ui/skeleton";
import { saveSession } from "@/app/actions/save-session";
import { authClient } from "@/lib/auth-client";
import type { TypingResult } from "@/lib/typing/use-typing-test";

const TypingTest = dynamic(
  () =>
    import("@/components/typing/typing-test").then((m) => ({
      default: m.TypingTest,
    })),
  {
    ssr: false,
    loading: () => <Skeleton className="h-72 w-full" />,
  },
);

export function LessonClient({
  lessonId,
  content,
  mode = "lesson",
}: {
  lessonId: string;
  content: string;
  mode?: "lesson" | "ai_lesson";
}) {
  const { data: session } = authClient.useSession();

  const onComplete = useCallback(
    async (result: TypingResult) => {
      if (!session) {
        toast.info("Sign up to save your lesson results.");
        return;
      }
      try {
        const res = await saveSession({
          mode,
          durationSec: result.durationSec,
          wpm: result.wpm,
          accuracy: result.accuracy,
          mistakes: result.mistakes,
          charsTyped: result.charsTyped,
          lessonId,
        });
        if (!res.ok) throw new Error(res.error);
        toast.success(`Saved · ${result.wpm} WPM · ${result.accuracy}% acc`);
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "Failed to save session",
        );
      }
    },
    [session, lessonId, mode],
  );

  return (
    <TypingTest
      sample={content}
      mode={mode}
      durationSec={null}
      lessonId={lessonId}
      onComplete={onComplete}
    />
  );
}
