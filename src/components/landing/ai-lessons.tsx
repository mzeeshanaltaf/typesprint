"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Wand2, Code2, BookOpen } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Section, SectionHeader } from "@/components/landing/section";

const perks = [
  {
    icon: Wand2,
    title: "Tailored to your level",
    body: "Pick beginner, intermediate, or advanced and TypeSprint adapts vocabulary and complexity.",
  },
  {
    icon: Code2,
    title: "Code drills that compile",
    body: "Generate JavaScript, TypeScript, or Python snippets with real syntax — no toy strings.",
  },
  {
    icon: BookOpen,
    title: "Saved for retyping",
    body: "Every AI lesson lands in your library with full attempt history so you can chase your best.",
  },
];

export function AiLessons() {
  return (
    <Section id="ai-lessons" className="bg-muted/30">
      <SectionHeader
        title="Practice on lessons generated just for you"
        description="Tell TypeSprint what you want to type — it writes the lesson, you keep the progress."
      />

      <div className="mt-14 grid gap-8 lg:grid-cols-2 lg:items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="order-2 lg:order-1"
        >
          <div className="flex flex-col gap-4">
            {perks.map((perk, i) => (
              <motion.div
                key={perk.title}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.4, delay: 0.1 + i * 0.06 }}
                className="flex items-start gap-4 rounded-xl border border-border/60 bg-card/60 p-5 backdrop-blur"
              >
                <div className="grid size-10 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-indigo-500/15 to-fuchsia-500/15 text-indigo-500 ring-1 ring-inset ring-indigo-500/20 dark:text-indigo-300">
                  <perk.icon className="size-5" />
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="text-base font-semibold">{perk.title}</h3>
                  <p className="text-sm text-muted-foreground">{perk.body}</p>
                </div>
              </motion.div>
            ))}

            <div className="mt-2">
              <Button asChild size="lg" className="gap-2">
                <Link href="/ai-lessons">
                  <Sparkles className="size-4" />
                  Generate your first lesson
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="order-1 lg:order-2"
        >
          <Card className="relative overflow-hidden border-border/60 bg-card/80 shadow-xl shadow-indigo-500/5 backdrop-blur">
            <div className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full bg-fuchsia-500/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -left-16 size-64 rounded-full bg-indigo-500/10 blur-3xl" />
            <CardContent className="relative flex flex-col gap-5 p-6 md:p-7">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  AI lesson preview
                </span>
                <Badge
                  variant="secondary"
                  className="gap-1 rounded-full border border-border/60"
                >
                  <Sparkles className="size-3 text-indigo-500" />
                  AI
                </Badge>
              </div>

              <div className="flex flex-col gap-3 rounded-lg border border-border/50 bg-background/60 p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary">intermediate</Badge>
                  <Badge variant="secondary">coding</Badge>
                  <Badge variant="secondary">typescript</Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Topic · React hooks rules
                </p>
                <code className="block whitespace-pre-wrap break-words rounded-md bg-muted/60 p-3 font-mono text-xs leading-relaxed text-foreground/90">
                  {`function useDebounced<T>(value: T, ms: number): T {
  const [v, setV] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setV(value), ms);
    return () => clearTimeout(id);
  }, [value, ms]);
  return v;
}`}
                </code>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="rounded-lg border border-border/50 bg-background/40 p-3">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Best WPM
                  </div>
                  <div className="mt-1 font-mono text-lg font-semibold">72</div>
                </div>
                <div className="rounded-lg border border-border/50 bg-background/40 p-3">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Best Acc
                  </div>
                  <div className="mt-1 font-mono text-lg font-semibold">
                    97%
                  </div>
                </div>
                <div className="rounded-lg border border-border/50 bg-background/40 p-3">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Attempts
                  </div>
                  <div className="mt-1 font-mono text-lg font-semibold">5</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </Section>
  );
}
