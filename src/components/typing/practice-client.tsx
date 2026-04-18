"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { TypingTest, type TypingMode } from "@/components/typing/typing-test";
import { authClient } from "@/lib/auth-client";
import { getLongSample, getRandomSample } from "@/lib/typing/text-source";
import type { TypingResult } from "@/lib/typing/use-typing-test";
import { cn } from "@/lib/utils";

const MODES: Array<{ value: TypingMode; label: string; seconds: number | null }> =
  [
    { value: "15", label: "15s", seconds: 15 },
    { value: "30", label: "30s", seconds: 30 },
    { value: "60", label: "60s", seconds: 60 },
    { value: "custom", label: "Free", seconds: null },
  ];

export function PracticeClient() {
  const { data: session } = authClient.useSession();
  const [mode, setMode] = useState<TypingMode>("30");
  const [sample, setSample] = useState<string>("");
  const [runKey, setRunKey] = useState(0);

  useEffect(() => {
    setSample(mode === "custom" ? getLongSample() : getRandomSample());
  }, [mode, runKey]);

  const seconds = MODES.find((m) => m.value === mode)?.seconds ?? 30;

  const onComplete = useCallback(
    async (result: TypingResult) => {
      if (!session) {
        toast.info("Sign up to save your results to your dashboard.", {
          duration: 5000,
        });
        return;
      }
      try {
        const res = await fetch("/api/sessions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mode,
            durationSec: result.durationSec,
            wpm: result.wpm,
            accuracy: result.accuracy,
            mistakes: result.mistakes,
            charsTyped: result.charsTyped,
          }),
        });
        if (!res.ok) {
          const body = await res.text();
          throw new Error(body || "Failed to save");
        }
        toast.success(`Saved · ${result.wpm} WPM · ${result.accuracy}% acc`);
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "Failed to save session",
        );
      }
    },
    [session, mode],
  );

  if (!sample) return null;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div
          role="tablist"
          aria-label="Typing mode"
          className="inline-flex rounded-lg border border-border/60 bg-background/40 p-1"
        >
          {MODES.map((m) => (
            <button
              key={m.value}
              role="tab"
              aria-selected={mode === m.value}
              onClick={() => setMode(m.value)}
              className={cn(
                "cursor-pointer rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                mode === m.value
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {m.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setRunKey((k) => k + 1)}
          >
            New text
          </Button>
          {!session && (
            <Button asChild size="sm">
              <Link href="/sign-up">Sign up to save</Link>
            </Button>
          )}
        </div>
      </div>

      <TypingTest
        key={`${mode}-${runKey}`}
        sample={sample}
        mode={mode}
        durationSec={seconds}
        onComplete={onComplete}
      />
    </div>
  );
}
