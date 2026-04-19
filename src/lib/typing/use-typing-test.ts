"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  computeAccuracy,
  computeWpm,
  countCorrect,
  countMistakes,
} from "./engine";

export type TypingStatus = "idle" | "running" | "done";

export type TypingResult = {
  wpm: number;
  accuracy: number;
  mistakes: number;
  charsTyped: number;
  durationSec: number;
};

export type UseTypingTestOptions = {
  sample: string;
  durationSec?: number | null; // null = no time limit (finish when text is done)
  onComplete?: (result: TypingResult) => void;
};

export function useTypingTest({
  sample,
  durationSec = 30,
  onComplete,
}: UseTypingTestOptions) {
  const [typed, setTyped] = useState("");
  const [status, setStatus] = useState<TypingStatus>("idle");
  const [remaining, setRemaining] = useState(durationSec ?? 0);
  const [elapsed, setElapsed] = useState(0);
  const startedAt = useRef<number | null>(null);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // timer tick
  useEffect(() => {
    if (status !== "running") return;
    const interval = window.setInterval(() => {
      if (startedAt.current != null) {
        const secs = Math.floor((Date.now() - startedAt.current) / 1000);
        setElapsed(secs);
        if (durationSec != null) {
          const r = Math.max(0, durationSec - secs);
          setRemaining(r);
          if (r <= 0) {
            setStatus("done");
          }
        }
      }
    }, 200);
    return () => window.clearInterval(interval);
  }, [status, durationSec]);

  // fire onComplete when transitioning to done
  const doneFired = useRef(false);
  useEffect(() => {
    if (status === "done" && !doneFired.current) {
      doneFired.current = true;
      const totalDuration =
        durationSec != null ? durationSec - remaining : elapsed;
      const correct = countCorrect(sample, typed);
      const wrong = countMistakes(sample, typed);
      const result: TypingResult = {
        wpm: computeWpm(correct, Math.max(1, totalDuration)),
        accuracy: computeAccuracy(correct, typed.length),
        mistakes: wrong,
        charsTyped: typed.length,
        durationSec: Math.max(1, totalDuration),
      };
      onCompleteRef.current?.(result);
    }
  }, [status, sample, typed, remaining, elapsed, durationSec]);

  const stats = useMemo(() => {
    const correct = countCorrect(sample, typed);
    const effectiveElapsed =
      status === "idle" ? 0 : Math.max(1, elapsed);
    return {
      wpm: status === "idle" ? 0 : computeWpm(correct, effectiveElapsed),
      accuracy: computeAccuracy(correct, typed.length),
      correct,
      remaining,
      elapsed,
    };
  }, [sample, typed, status, remaining, elapsed]);

  const handleKey = useCallback(
    (key: string) => {
      if (status === "done") return;
      if (key === "Backspace") {
        setTyped((t) => t.slice(0, -1));
        return;
      }
      // ignore modifier/nav/function keys (except \n which we pass explicitly for newlines)
      if (key !== "\n" && key.length !== 1) return;
      if (status === "idle") {
        setStatus("running");
        startedAt.current = Date.now();
      }
      setTyped((t) => {
        if (t.length >= sample.length) return t;
        const next = t + key;
        if (next.length === sample.length) {
          setStatus("done");
        }
        return next;
      });
    },
    [status, sample.length],
  );

  const reset = useCallback(() => {
    setTyped("");
    setStatus("idle");
    setRemaining(durationSec ?? 0);
    setElapsed(0);
    startedAt.current = null;
    doneFired.current = false;
  }, [durationSec]);

  return {
    typed,
    status,
    stats,
    handleKey,
    reset,
  };
}
