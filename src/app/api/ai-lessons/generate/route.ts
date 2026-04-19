import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { lesson } from "@/db/schema";
import { openai, OPENAI_MODEL } from "@/lib/openai";

const BodySchema = z
  .object({
    level: z.enum(["beginner", "intermediate", "advanced"]),
    category: z.enum([
      "paragraph",
      "numbers",
      "symbols",
      "coding",
      "mixed",
    ]),
    length: z.enum(["short", "medium", "long"]),
    topic: z.string().trim().max(80).optional(),
    tone: z
      .enum(["neutral", "educational", "casual", "technical", "narrative"])
      .optional(),
    language: z.enum(["javascript", "typescript", "python"]).optional(),
  })
  .refine(
    (v) => v.category !== "coding" || !!v.language,
    { message: "language is required when category is 'coding'" },
  );

function wordCountForLength(length: "short" | "medium" | "long"): number {
  if (length === "short") return 50;
  if (length === "medium") return 120;
  return 250;
}

function buildPrompt(input: z.infer<typeof BodySchema>): string {
  const target = wordCountForLength(input.length);
  const topic = input.topic?.trim() || "general interest";
  const tone = input.tone ?? "neutral";
  const codingNote =
    input.category === "coding"
      ? `Use valid, runnable ${input.language} syntax. Multi-line is allowed (use \\n in JSON). Preserve indentation. Do NOT wrap with markdown code fences.`
      : "";
  const categoryNote =
    input.category === "numbers"
      ? "Include numerals, dates, and percentages naturally within the prose."
      : input.category === "symbols"
        ? "Use punctuation, brackets, and operators in realistic contexts (URLs, emails, basic math)."
        : input.category === "mixed"
          ? "Blend prose, numbers, and symbols naturally in a single passage."
          : input.category === "paragraph"
            ? "Plain prose only — no special formatting."
            : "";

  return [
    "You generate text for a typing-practice app.",
    'Return ONLY a strict JSON object: { "title": "<4-6 word title>", "content": "<the practice text>" }',
    "",
    "Constraints:",
    `- Difficulty: ${input.level}`,
    `- Type: ${input.category}${input.language ? ` in ${input.language}` : ""}`,
    `- Target length: about ${target} words (±20%)`,
    `- Topic: ${topic}`,
    `- Tone: ${tone}`,
    codingNote,
    categoryNote,
    "- No markdown, no headings, no bullet lists in the content.",
    "- No leading or trailing whitespace.",
    "- Title should be short and descriptive, no quotes.",
    "- Return JSON only — no surrounding prose, no code fences.",
  ]
    .filter(Boolean)
    .join("\n");
}

type AiLesson = { title: string; content: string };

function stripCodeFences(s: string): string {
  return s
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();
}

function parseAiResponse(raw: string): AiLesson | null {
  const trimmed = stripCodeFences(raw.trim());
  try {
    const parsed = JSON.parse(trimmed) as unknown;
    if (
      parsed &&
      typeof parsed === "object" &&
      "title" in parsed &&
      "content" in parsed &&
      typeof (parsed as Record<string, unknown>).title === "string" &&
      typeof (parsed as Record<string, unknown>).content === "string"
    ) {
      const title = (parsed as { title: string; content: string }).title.trim();
      const content = (parsed as { title: string; content: string }).content;
      if (title && content) return { title, content };
    }
  } catch {
    // fall through
  }
  return null;
}

function fallbackTitle(input: z.infer<typeof BodySchema>): string {
  const parts: string[] = [input.level, input.category];
  if (input.language) parts.push(input.language);
  if (input.topic) parts.push(`— ${input.topic}`);
  const s = parts.join(" ").replace(/\s+/g, " ").trim();
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid body", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const input = parsed.data;
  const prompt = buildPrompt(input);

  let outputText: string;
  try {
    const response = await openai.responses.create({
      model: OPENAI_MODEL,
      input: prompt,
    });
    outputText = response.output_text ?? "";
  } catch (err) {
    console.error("openai.responses.create failed", err);
    return NextResponse.json(
      { error: "AI generation failed" },
      { status: 502 },
    );
  }

  const ai = parseAiResponse(outputText) ?? {
    title: fallbackTitle(input),
    content: stripCodeFences(outputText),
  };

  if (!ai.content || ai.content.length < 20) {
    return NextResponse.json(
      { error: "AI returned empty or too-short content" },
      { status: 502 },
    );
  }

  const id = randomUUID();
  await db.insert(lesson).values({
    id,
    level: input.level,
    category: input.category,
    title: ai.title,
    content: ai.content,
    orderIndex: 0,
    source: "ai",
    userId: session.user.id,
    topic: input.topic ?? null,
    tone: input.tone ?? null,
    language: input.language ?? null,
  });

  revalidatePath("/ai-lessons");

  return NextResponse.json({ id });
}
