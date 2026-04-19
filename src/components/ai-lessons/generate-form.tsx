"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type Level = "beginner" | "intermediate" | "advanced";
type Category = "paragraph" | "numbers" | "symbols" | "coding" | "mixed";
type Length = "short" | "medium" | "long";
type Tone = "neutral" | "educational" | "casual" | "technical" | "narrative";
type Language = "javascript" | "typescript" | "python";

const CATEGORY_OPTIONS: { value: Category; label: string; hint: string }[] = [
  { value: "paragraph", label: "Paragraph", hint: "Plain prose" },
  { value: "numbers", label: "Numbers", hint: "Digits & dates" },
  { value: "symbols", label: "Symbols", hint: "Punctuation & math" },
  { value: "coding", label: "Coding", hint: "Real source code" },
  { value: "mixed", label: "Mixed", hint: "All of the above" },
];

const LENGTH_OPTIONS: { value: Length; label: string; hint: string }[] = [
  { value: "short", label: "Short", hint: "~50 words" },
  { value: "medium", label: "Medium", hint: "~120 words" },
  { value: "long", label: "Long", hint: "~250 words" },
];

export function GenerateForm() {
  const router = useRouter();
  const [level, setLevel] = useState<Level>("beginner");
  const [category, setCategory] = useState<Category>("paragraph");
  const [length, setLength] = useState<Length>("medium");
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState<Tone>("neutral");
  const [language, setLanguage] = useState<Language>("typescript");
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/ai-lessons/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          level,
          category,
          length,
          topic: topic.trim() || undefined,
          tone,
          ...(category === "coding" ? { language } : {}),
        }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to generate lesson");
      }
      const data = (await res.json()) as { id: string };
      toast.success("Lesson generated");
      router.push(`/ai-lessons/${data.id}`);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to generate lesson",
      );
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col gap-6 rounded-xl border border-border/60 bg-card/60 p-6 backdrop-blur md:p-8"
    >
      <div className="grid gap-6 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="level">Difficulty</Label>
          <Select value={level} onValueChange={(v) => setLevel(v as Level)}>
            <SelectTrigger id="level">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="tone">Tone</Label>
          <Select value={tone} onValueChange={(v) => setTone(v as Tone)}>
            <SelectTrigger id="tone">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="neutral">Neutral</SelectItem>
              <SelectItem value="educational">Educational</SelectItem>
              <SelectItem value="casual">Casual</SelectItem>
              <SelectItem value="technical">Technical</SelectItem>
              <SelectItem value="narrative">Narrative</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label>Lesson type</Label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
          {CATEGORY_OPTIONS.map((opt) => {
            const active = category === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setCategory(opt.value)}
                className={cn(
                  "flex flex-col items-start gap-0.5 rounded-lg border p-3 text-left text-sm transition-colors",
                  active
                    ? "border-foreground bg-foreground/5"
                    : "border-border/60 hover:border-border hover:bg-muted/40",
                )}
                aria-pressed={active}
              >
                <span className="font-medium">{opt.label}</span>
                <span className="text-xs text-muted-foreground">
                  {opt.hint}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {category === "coding" && (
        <div className="flex flex-col gap-2">
          <Label htmlFor="language">Language</Label>
          <Select
            value={language}
            onValueChange={(v) => setLanguage(v as Language)}
          >
            <SelectTrigger id="language" className="md:max-w-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="javascript">JavaScript</SelectItem>
              <SelectItem value="typescript">TypeScript</SelectItem>
              <SelectItem value="python">Python</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <Label>Length</Label>
        <div className="grid grid-cols-3 gap-2">
          {LENGTH_OPTIONS.map((opt) => {
            const active = length === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setLength(opt.value)}
                className={cn(
                  "flex flex-col items-start gap-0.5 rounded-lg border p-3 text-left text-sm transition-colors",
                  active
                    ? "border-foreground bg-foreground/5"
                    : "border-border/60 hover:border-border hover:bg-muted/40",
                )}
                aria-pressed={active}
              >
                <span className="font-medium">{opt.label}</span>
                <span className="text-xs text-muted-foreground">
                  {opt.hint}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="topic">
          Topic <span className="text-muted-foreground">(optional)</span>
        </Label>
        <Input
          id="topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g. space exploration, sorting algorithms, coffee brewing"
          maxLength={80}
        />
        <p className="text-xs text-muted-foreground">
          A focused topic produces more interesting practice text.
        </p>
      </div>

      <div className="flex items-center justify-end">
        <Button type="submit" disabled={submitting} className="gap-2">
          {submitting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Generating…
            </>
          ) : (
            <>
              <Sparkles className="size-4" />
              Generate lesson
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
