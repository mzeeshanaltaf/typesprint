"use client";

import { motion } from "framer-motion";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Section, SectionHeader } from "@/components/landing/section";

const testimonials = [
  {
    name: "Aisha N.",
    role: "Computer Science student",
    quote:
      "I went from 38 to 72 WPM in two months. The lesson progression actually made it fun to keep showing up.",
    initials: "AN",
  },
  {
    name: "Daniel K.",
    role: "Freelance writer",
    quote:
      "Real-time accuracy made me realize I was sloppy on symbols. Fixed it in a week. Worth every minute.",
    initials: "DK",
  },
  {
    name: "Priya S.",
    role: "Operations manager",
    quote:
      "Inbox zero takes me half the time now. The streak feature is annoyingly motivating in the best way.",
    initials: "PS",
  },
];

export function Testimonials() {
  return (
    <Section id="testimonials" className="bg-muted/30">
      <SectionHeader
        eyebrow="Testimonials"
        title="Loved by students, writers, and professionals"
      />

      <div className="mt-14 grid gap-5 md:grid-cols-3">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
          >
            <Card className="h-full border-border/60 bg-card/60 backdrop-blur">
              <CardContent className="flex h-full flex-col gap-5 p-6">
                <p className="text-base leading-relaxed text-foreground/90">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="mt-auto flex items-center gap-3">
                  <Avatar className="size-10">
                    <AvatarFallback className="bg-gradient-to-br from-indigo-500/20 to-fuchsia-500/20 text-foreground">
                      {t.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-sm font-medium">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.role}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
