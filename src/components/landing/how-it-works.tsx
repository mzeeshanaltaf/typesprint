"use client";

import { motion } from "framer-motion";

import { Section, SectionHeader } from "@/components/landing/section";

const steps = [
  {
    n: "01",
    title: "Choose a lesson",
    body: "Pick a level — beginner, intermediate, or advanced — or jump into a free sprint.",
  },
  {
    n: "02",
    title: "Start typing",
    body: "Type the prompt. Mistakes are highlighted live and corrected as you go.",
  },
  {
    n: "03",
    title: "Improve stats",
    body: "Watch your WPM and accuracy climb session after session.",
  },
  {
    n: "04",
    title: "Track growth",
    body: "Open your dashboard to see streaks, trends, and personal bests.",
  },
];

export function HowItWorks() {
  return (
    <Section id="how" className="bg-muted/30">
      <SectionHeader
        eyebrow="How it works"
        title="From zero to flow in four steps"
        description="A simple loop designed to make practice feel like a game, not a chore."
      />

      <ol className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, i) => (
          <motion.li
            key={step.n}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
            className="relative rounded-2xl border border-border/60 bg-card/60 p-6 backdrop-blur"
          >
            <div className="text-sm font-mono font-semibold text-muted-foreground">
              {step.n}
            </div>
            <h3 className="mt-3 text-lg font-semibold">{step.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{step.body}</p>
          </motion.li>
        ))}
      </ol>
    </Section>
  );
}
