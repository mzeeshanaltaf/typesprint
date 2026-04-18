"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

export function FinalCta() {
  return (
    <section className="w-full px-4 pb-24 md:px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
        className="relative mx-auto w-full max-w-5xl overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-indigo-500/15 via-fuchsia-500/10 to-rose-500/10 p-10 text-center md:p-16"
      >
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-fuchsia-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />
        <h2 className="text-balance text-3xl font-semibold tracking-tight md:text-4xl">
          Ready to sprint past your old WPM?
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-balance text-muted-foreground">
          Create a free account and start tracking your progress in under 30
          seconds.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild size="lg" className="gap-2">
            <Link href="/sign-up">
              Get started — it&apos;s free
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/practice">Try a sprint first</Link>
          </Button>
        </div>
      </motion.div>
    </section>
  );
}
