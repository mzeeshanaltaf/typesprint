"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Section, SectionHeader } from "@/components/landing/section";

const features = [
  "Unlimited 15s / 30s / 60s sprints",
  "All beginner, intermediate & advanced lessons",
  "AI-generated lessons (any topic)",
  "Coding lessons (JavaScript, TypeScript, Python)",
  "Real-time WPM & accuracy",
  "Full progress dashboard & charts",
  "Streaks, personal bests & history",
  "Light & dark mode",
];

export function Pricing() {
  return (
    <Section id="pricing">
      <SectionHeader
        eyebrow="Pricing"
        title="Free, forever"
        description="Every feature, every lesson, every drill — no paywall, no credit card."
      />

      <div className="mx-auto mt-14 max-w-xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.4 }}
        >
          <Card className="relative h-full border-transparent bg-gradient-to-b from-indigo-500/10 via-fuchsia-500/5 to-transparent shadow-xl shadow-indigo-500/5 ring-1 ring-indigo-500/20">
            <Badge className="absolute right-6 top-6 gap-1 bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-white">
              <Sparkles className="size-3" />
              Free forever
            </Badge>
            <CardContent className="flex h-full flex-col gap-6 p-8">
              <div className="flex flex-col gap-2">
                <h3 className="text-lg font-semibold">Free</h3>
                <p className="text-sm text-muted-foreground">
                  Everything TypeSprint offers, available to everyone.
                </p>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-semibold tracking-tight">
                  $0
                </span>
                <span className="text-sm text-muted-foreground">/forever</span>
              </div>
              <ul className="grid gap-3 text-sm sm:grid-cols-2">
                {features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <Check className="mt-0.5 size-4 shrink-0 text-indigo-500" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Button asChild size="lg" className="mt-auto">
                <Link href="/sign-up">Create your free account</Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </Section>
  );
}
