"use client";

import { motion } from "framer-motion";
import { Briefcase, Rocket, GraduationCap, Code2 } from "lucide-react";

import { Section, SectionHeader } from "@/components/landing/section";

const benefits = [
  {
    icon: Rocket,
    title: "Better productivity",
    body: "Type at the speed of thought. Spend less time on keys, more time on ideas.",
  },
  {
    icon: Briefcase,
    title: "Faster work speed",
    body: "Crush emails, docs, and meetings without breaking your flow.",
  },
  {
    icon: GraduationCap,
    title: "Competitive exam prep",
    body: "Build the speed and accuracy needed for typing assessments.",
  },
  {
    icon: Code2,
    title: "Coding speed",
    body: "Practice with real code snippets — symbols, brackets, indentation included.",
  },
];

export function Benefits() {
  return (
    <Section id="benefits">
      <SectionHeader
        eyebrow="Why TypeSprint"
        title="Real benefits, beyond the leaderboard"
        description="Faster typing pays compounding dividends in study, work, and creative output."
      />

      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {benefits.map((b, i) => (
          <motion.div
            key={b.title}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="rounded-2xl border border-border/60 bg-gradient-to-br from-background to-muted/40 p-6"
          >
            <div className="grid size-11 place-items-center rounded-xl bg-foreground/5 text-foreground">
              <b.icon className="size-5" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">{b.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{b.body}</p>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
