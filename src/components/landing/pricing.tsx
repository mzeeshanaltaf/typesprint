"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Section, SectionHeader } from "@/components/landing/section";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "/forever",
    description: "Everything you need to get started.",
    features: [
      "Unlimited 15s / 30s / 60s sprints",
      "Beginner & intermediate lessons",
      "Real-time WPM & accuracy",
      "Light & dark mode",
    ],
    cta: { label: "Start free", href: "/sign-up" },
    highlight: false,
  },
  {
    name: "Pro",
    price: "$5",
    period: "/month",
    description: "For learners who want to track real progress.",
    features: [
      "Everything in Free",
      "All advanced & coding lessons",
      "Full progress dashboard & charts",
      "Streaks, personal bests, exports",
      "Priority email support",
    ],
    cta: { label: "Get Pro", href: "/sign-up" },
    highlight: true,
  },
];

export function Pricing() {
  return (
    <Section id="pricing">
      <SectionHeader
        eyebrow="Pricing"
        title="Simple pricing, pay when you’re serious"
        description="Free covers the essentials. Pro unlocks deeper insights and the full library."
      />

      <div className="mx-auto mt-14 grid max-w-4xl gap-6 md:grid-cols-2">
        {plans.map((plan, i) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
          >
            <Card
              className={cn(
                "relative h-full border-border/60",
                plan.highlight &&
                  "border-transparent bg-gradient-to-b from-indigo-500/10 via-fuchsia-500/5 to-transparent shadow-xl shadow-indigo-500/5 ring-1 ring-indigo-500/20",
              )}
            >
              {plan.highlight && (
                <Badge className="absolute right-6 top-6 bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-white">
                  Most popular
                </Badge>
              )}
              <CardContent className="flex h-full flex-col gap-6 p-8">
                <div className="flex flex-col gap-2">
                  <h3 className="text-lg font-semibold">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {plan.description}
                  </p>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-semibold tracking-tight">
                    {plan.price}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {plan.period}
                  </span>
                </div>
                <ul className="flex flex-col gap-3 text-sm">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <Check className="mt-0.5 size-4 shrink-0 text-indigo-500" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  asChild
                  size="lg"
                  variant={plan.highlight ? "default" : "outline"}
                  className="mt-auto"
                >
                  <Link href={plan.cta.href}>{plan.cta.label}</Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
