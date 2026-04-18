"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Section, SectionHeader } from "@/components/landing/section";

const faqs = [
  {
    q: "How do I improve my typing speed?",
    a: "Consistency beats intensity. Aim for 10–15 focused minutes per day, prioritize accuracy over raw speed early on, and let TypeSprint guide you from drills to full paragraphs as you progress.",
  },
  {
    q: "Is TypeSprint free?",
    a: "Yes — the Free plan covers unlimited sprints, beginner and intermediate lessons, and real-time WPM/accuracy. Pro unlocks the full lesson library, charts, and streak tracking.",
  },
  {
    q: "Can kids and beginners use it?",
    a: "Absolutely. The beginner level starts with home-row drills and short words, with mistakes highlighted clearly so new typists can learn good habits from day one.",
  },
  {
    q: "Do I need an account to try it?",
    a: "No. You can run sprints right from the landing page or the practice tab without signing in. Create an account when you’re ready to track progress.",
  },
  {
    q: "What devices does TypeSprint support?",
    a: "Any modern desktop or laptop browser. A physical keyboard is required for an accurate experience — touch-only typing isn’t supported yet.",
  },
];

export function Faq() {
  return (
    <Section id="faq">
      <SectionHeader
        eyebrow="FAQ"
        title="Frequently asked questions"
        description="Everything you might want to know before getting started."
      />

      <div className="mx-auto mt-12 max-w-3xl">
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((item, i) => (
            <AccordionItem key={item.q} value={`item-${i}`}>
              <AccordionTrigger className="text-left text-base font-medium">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </Section>
  );
}
