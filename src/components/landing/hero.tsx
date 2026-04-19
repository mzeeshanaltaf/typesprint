"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TypingDemo } from "@/components/landing/typing-demo";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-x-0 top-0 h-[640px] bg-[radial-gradient(ellipse_70%_50%_at_50%_-10%,oklch(0.55_0.22_265/0.20),transparent_70%)] dark:bg-[radial-gradient(ellipse_70%_50%_at_50%_-10%,oklch(0.55_0.22_265/0.35),transparent_70%)]" />
        <div className="absolute -right-24 top-32 h-72 w-72 rounded-full bg-fuchsia-500/15 blur-3xl dark:bg-fuchsia-500/20" />
        <div className="absolute -left-24 top-64 h-72 w-72 rounded-full bg-indigo-500/15 blur-3xl dark:bg-indigo-500/20" />
      </div>

      <div className="mx-auto flex w-full max-w-7xl flex-col items-center px-4 pb-16 pt-16 text-center md:px-6 md:pt-24 md:pb-24">
        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeUp}
          transition={{ duration: 0.5 }}
        >
          <Badge
            variant="secondary"
            className="gap-1.5 rounded-full border border-border/60 bg-background/60 px-3 py-1 text-xs font-medium backdrop-blur"
          >
            <Sparkles className="size-3 text-indigo-500" />
            New · AI-generated typing lessons
          </Badge>
        </motion.div>

        <motion.h1
          initial="hidden"
          animate="show"
          variants={fadeUp}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="mt-6 max-w-4xl text-balance text-4xl font-semibold tracking-tight md:text-6xl lg:text-7xl"
        >
          Learn typing{" "}
          <span className="bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-rose-500 bg-clip-text text-transparent">
            faster & smarter
          </span>
        </motion.h1>

        <motion.p
          initial="hidden"
          animate="show"
          variants={fadeUp}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-6 max-w-2xl text-balance text-lg text-muted-foreground md:text-xl"
        >
          Sprint through real-time drills, follow structured lessons, or
          generate your own AI lesson on any topic, difficulty, and length —
          then watch your progress climb in a dashboard built to motivate.
        </motion.p>

        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeUp}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-8 flex flex-col gap-3 sm:flex-row"
        >
          <Button asChild size="lg" className="gap-2">
            <Link href="/practice">
              Start Free Test
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="gap-2">
            <Link href="/ai-lessons">
              <Sparkles className="size-4 text-indigo-500" />
              Generate with AI
            </Link>
          </Button>
          <Button asChild size="lg" variant="ghost">
            <Link href="/lessons">View Lessons</Link>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-14 w-full max-w-3xl"
        >
          <TypingDemo />
        </motion.div>
      </div>
    </section>
  );
}
