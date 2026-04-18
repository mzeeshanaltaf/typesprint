"use client";

import { motion } from "framer-motion";
import {
  Activity,
  Target,
  GraduationCap,
  LineChart,
  Moon,
  Keyboard,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Section, SectionHeader } from "@/components/landing/section";

const features = [
  {
    icon: Activity,
    title: "Real-time WPM",
    description:
      "See your words-per-minute update on every keystroke so you always know where you stand.",
  },
  {
    icon: Target,
    title: "Accuracy monitoring",
    description:
      "Mistakes are highlighted instantly and tracked over time so you can hunt down weak spots.",
  },
  {
    icon: GraduationCap,
    title: "Beginner → advanced",
    description:
      "Structured lessons that grow with you — from home row drills to coding snippets.",
  },
  {
    icon: LineChart,
    title: "Progress analytics",
    description:
      "Beautiful dashboards reveal trends in speed, accuracy, and practice consistency.",
  },
  {
    icon: Keyboard,
    title: "Multiple modes",
    description:
      "Sprint for 15s, push through 30s/60s, or set a custom timer to suit your goals.",
  },
  {
    icon: Moon,
    title: "Dark mode",
    description:
      "A polished light and dark theme designed for long, comfortable practice sessions.",
  },
];

export function Features() {
  return (
    <Section id="features">
      <SectionHeader
        eyebrow="Features"
        title="Everything you need to type with confidence"
        description="Purpose-built for fast feedback loops — practice, measure, improve, repeat."
      />

      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, i) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
          >
            <Card className="group h-full border-border/60 bg-card/60 backdrop-blur transition-colors hover:border-border">
              <CardContent className="flex flex-col gap-4 p-6">
                <div className="grid size-11 place-items-center rounded-xl bg-gradient-to-br from-indigo-500/15 to-fuchsia-500/15 text-indigo-500 ring-1 ring-inset ring-indigo-500/20 dark:text-indigo-300">
                  <feature.icon className="size-5" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <h3 className="text-lg font-semibold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
