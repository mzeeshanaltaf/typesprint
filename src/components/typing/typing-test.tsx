"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Keyboard, RotateCcw, Timer } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { computeCharStates } from "@/lib/typing/engine";
import {
  useTypingTest,
  type TypingResult,
} from "@/lib/typing/use-typing-test";

export type TypingMode = "15" | "30" | "60" | "custom" | "lesson" | "ai_lesson";

type Props = {
  sample: string;
  mode: TypingMode;
  durationSec: number | null;
  lessonId?: string | null;
  onComplete?: (result: TypingResult) => void;
};

export function TypingTest({
  sample,
  mode,
  durationSec,
  lessonId,
  onComplete,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cursorCharRef = useRef<HTMLSpanElement>(null);
  const [focused, setFocused] = useState(true);
  const [result, setResult] = useState<TypingResult | null>(null);

  const { typed, status, stats, handleKey, reset } = useTypingTest({
    sample,
    durationSec,
    onComplete: (r) => {
      setResult(r);
      onComplete?.(r);
    },
  });

  useEffect(() => {
    // keep focus on the surface so key events fire
    containerRef.current?.focus();
  }, [sample]);

  const hasNewlines = sample.includes("\n");

  // Stable ref so the listener never needs re-registration when handleKey changes
  // (e.g. idle→running transition), eliminating the brief gap where Enter gets dropped.
  const handleKeyRef = useRef(handleKey);
  useEffect(() => { handleKeyRef.current = handleKey; });

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (!focused) return;
      if (status === "done") return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === "Tab" || e.key === "Escape") return;
      if (e.key === "Enter") {
        if (hasNewlines) {
          e.preventDefault();
          handleKeyRef.current("\n");
        }
        return;
      }
      if (e.key === "Backspace" || e.key.length === 1) {
        e.preventDefault();
        handleKeyRef.current(e.key);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [focused, status, hasNewlines]); // handleKey intentionally omitted — accessed via ref

  // Scroll the cursor character into view whenever it moves.
  useEffect(() => {
    cursorCharRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [typed.length]);

  const charStates = useMemo(
    () => computeCharStates(sample, typed),
    [sample, typed],
  );

  const timerLabel = useMemo(() => {
    if (status === "done") return "00:00";
    if (durationSec == null) {
      const s = stats.elapsed;
      return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(
        s % 60,
      ).padStart(2, "0")}`;
    }
    const r = stats.remaining;
    return `${String(Math.floor(r / 60)).padStart(2, "0")}:${String(
      r % 60,
    ).padStart(2, "0")}`;
  }, [status, durationSec, stats.elapsed, stats.remaining]);

  return (
    <Card className="border-border/60 bg-card/70 shadow-2xl shadow-indigo-500/5 backdrop-blur">
      <CardContent className="flex flex-col gap-6 p-6 md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Keyboard className="size-4" />
            <span>
              {mode === "lesson"
                ? "Lesson"
                : mode === "custom"
                  ? "Custom"
                  : `${mode}s sprint`}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="gap-1.5 font-mono">
              <Timer className="size-3" />
              {timerLabel}
            </Badge>
            <Badge variant="secondary" className="font-mono">
              {stats.wpm} WPM
            </Badge>
            <Badge variant="secondary" className="font-mono">
              {stats.accuracy}% acc
            </Badge>
          </div>
        </div>

        <div
          ref={containerRef}
          tabIndex={0}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onClick={() => containerRef.current?.focus()}
          className={cn(
            "relative cursor-text rounded-xl border border-border/60 bg-background/40 p-6 font-mono text-lg leading-relaxed tracking-wide outline-none transition-all [font-variant-ligatures:none] md:text-xl",
            focused && "ring-2 ring-ring/40",
          )}
          aria-label="Typing area"
        >
          {sample.split("").map((char, i) => {
            const state = charStates[i];
            const isCursor = i === typed.length && status !== "done";
            const isNewline = char === "\n";
            return (
              <span key={i} ref={isCursor ? cursorCharRef : null} className="relative">
                {isCursor && (
                  <motion.span
                    layoutId={`cursor-${lessonId ?? mode}`}
                    className="pointer-events-none absolute inset-y-0 left-0 w-0.5 rounded-full bg-foreground"
                    transition={{ type: "spring", stiffness: 600, damping: 40 }}
                  />
                )}
                <span
                  className={cn(
                    state === "pending" && "text-muted-foreground/60",
                    state === "correct" && "text-foreground",
                    state === "wrong" &&
                      "rounded bg-destructive/20 text-destructive",
                    isNewline && "block",
                  )}
                >
                  {isNewline ? "↵\n" : char}
                </span>
              </span>
            );
          })}

          {status === "idle" && typed.length === 0 && (
            <p className="pointer-events-none absolute bottom-2 right-3 text-xs text-muted-foreground">
              Click and start typing
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            Backspace to correct mistakes. Timer starts on first keystroke.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setResult(null);
              reset();
              containerRef.current?.focus();
            }}
            className="gap-2"
          >
            <RotateCcw className="size-3.5" />
            Restart
          </Button>
        </div>

        {result && (
          <ResultSummary result={result} mode={mode} />
        )}
      </CardContent>
    </Card>
  );
}

function ResultSummary({
  result,
  mode,
}: {
  result: TypingResult;
  mode: TypingMode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="grid grid-cols-2 gap-3 rounded-xl border border-border/60 bg-muted/30 p-5 md:grid-cols-4"
    >
      <Stat label="WPM" value={result.wpm.toString()} />
      <Stat label="Accuracy" value={`${result.accuracy}%`} />
      <Stat label="Mistakes" value={result.mistakes.toString()} />
      <Stat
        label={mode === "lesson" ? "Time" : "Duration"}
        value={`${result.durationSec}s`}
      />
    </motion.div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <span className="font-mono text-2xl font-semibold">{value}</span>
    </div>
  );
}
