"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Keyboard, RotateCcw, Timer } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const SAMPLE = "the quick brown fox jumps over the lazy dog every single day";
const DURATION = 15;

type Status = "idle" | "running" | "done";

export function TypingDemo() {
  const [typed, setTyped] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [remaining, setRemaining] = useState(DURATION);
  const inputRef = useRef<HTMLInputElement>(null);
  const startedAt = useRef<number | null>(null);

  useEffect(() => {
    if (status !== "running") return;
    const interval = window.setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          window.clearInterval(interval);
          setStatus("done");
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => window.clearInterval(interval);
  }, [status]);

  const stats = useMemo(() => {
    const elapsed =
      status === "idle"
        ? 0
        : Math.max(1, DURATION - remaining);
    let correct = 0;
    for (let i = 0; i < typed.length; i++) {
      if (typed[i] === SAMPLE[i]) correct++;
    }
    const wpm = Math.round((correct / 5) * (60 / Math.max(1, elapsed)));
    const accuracy = typed.length
      ? Math.round((correct / typed.length) * 100)
      : 100;
    return { wpm: status === "idle" ? 0 : wpm, accuracy };
  }, [typed, remaining, status]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (status === "done") return;
    const value = e.target.value;
    if (status === "idle" && value.length > 0) {
      setStatus("running");
      startedAt.current = Date.now();
    }
    if (value.length > SAMPLE.length) return;
    setTyped(value);
    if (value.length === SAMPLE.length) {
      setStatus("done");
    }
  }

  function reset() {
    setTyped("");
    setStatus("idle");
    setRemaining(DURATION);
    startedAt.current = null;
    inputRef.current?.focus();
  }

  return (
    <Card className="border-border/60 bg-card/70 p-2 shadow-2xl shadow-indigo-500/5 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <CardContent className="flex flex-col gap-5 p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Keyboard className="size-4" />
            <span>15-second sprint demo</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="gap-1.5">
              <Timer className="size-3" />
              {remaining}s
            </Badge>
            <Badge variant="secondary">{stats.wpm} WPM</Badge>
            <Badge variant="secondary">{stats.accuracy}% acc</Badge>
          </div>
        </div>

        <button
          type="button"
          onClick={() => inputRef.current?.focus()}
          className="cursor-text rounded-lg border border-border/60 bg-background/40 p-5 text-left font-mono text-lg leading-relaxed tracking-wide outline-none focus-within:ring-2 focus-within:ring-ring/40 md:text-xl"
        >
          {SAMPLE.split("").map((char, i) => {
            const typedChar = typed[i];
            const state =
              typedChar === undefined
                ? "pending"
                : typedChar === char
                  ? "correct"
                  : "wrong";
            const isCursor = i === typed.length;
            return (
              <span key={i} className="relative">
                {isCursor && status !== "done" && (
                  <motion.span
                    layoutId="demo-cursor"
                    className="pointer-events-none absolute inset-y-0 left-0 w-px bg-foreground"
                    transition={{ type: "spring", stiffness: 500, damping: 40 }}
                  />
                )}
                <span
                  className={cn(
                    state === "pending" && "text-muted-foreground/60",
                    state === "correct" && "text-foreground",
                    state === "wrong" &&
                      "rounded bg-destructive/20 text-destructive",
                  )}
                >
                  {char}
                </span>
              </span>
            );
          })}
        </button>

        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Click the text and start typing.
          </p>
          <Button variant="ghost" size="sm" onClick={reset} className="gap-2">
            <RotateCcw className="size-3.5" />
            Reset
          </Button>
        </div>

        <input
          ref={inputRef}
          value={typed}
          onChange={handleChange}
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          className="sr-only"
          aria-label="Typing input"
        />
      </CardContent>
    </Card>
  );
}
