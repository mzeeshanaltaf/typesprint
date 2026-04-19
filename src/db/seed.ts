import "dotenv/config";
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { eq } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import * as schema from "./schema";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool, { schema });

const lessons: Array<{
  level: "beginner" | "intermediate" | "advanced";
  category: "home_row" | "numbers" | "symbols" | "paragraph" | "coding";
  title: string;
  content: string;
}> = [
  // Beginner — home row
  {
    level: "beginner",
    category: "home_row",
    title: "Home Row Basics",
    content:
      "asdf jkl; asdf jkl; asdf jkl; sad lad jak fad lass salad flask alfalfa",
  },
  {
    level: "beginner",
    category: "home_row",
    title: "Home Row Words",
    content:
      "ask dad fall fad lass jak salad flask alfalfa half had has jaks lads",
  },
  {
    level: "beginner",
    category: "home_row",
    title: "Top Row Reach",
    content:
      "the quick true quote require quietly write where wonder power tower",
  },
  // Beginner — paragraph
  {
    level: "beginner",
    category: "paragraph",
    title: "Simple Sentences",
    content:
      "The cat sat on the mat. A dog ran in the park. The sun is bright today. Birds sing in the morning.",
  },
  // Intermediate — numbers
  {
    level: "intermediate",
    category: "numbers",
    title: "Number Row",
    content:
      "1234567890 1029 3847 5610 7283 4956 8172 6304 5829 1746 2058 3917 4628",
  },
  {
    level: "intermediate",
    category: "numbers",
    title: "Numbers in Context",
    content:
      "Order 4521 shipped on 03/14/2026 with tracking 9988-7766. Total: $1,250.99 for 12 items.",
  },
  // Intermediate — symbols
  {
    level: "intermediate",
    category: "symbols",
    title: "Common Symbols",
    content:
      "! @ # $ % ^ & * ( ) - _ = + [ ] { } ; : ' \" , . / ? < > | \\ ~ `",
  },
  {
    level: "intermediate",
    category: "symbols",
    title: "Symbols in Sentences",
    content:
      "Email me at user@example.com! The total is $99.99 (incl. tax). Visit https://typesprint.app/lessons.",
  },
  // Intermediate — paragraph
  {
    level: "intermediate",
    category: "paragraph",
    title: "News Headline",
    content:
      "Researchers announced a major breakthrough today, demonstrating a new technique that improves accuracy by nearly forty percent in early trials.",
  },
  {
    level: "intermediate",
    category: "paragraph",
    title: "Productivity Tips",
    content:
      "Plan your day the night before. Tackle the hardest task first while your focus is sharp. Take short breaks every fifty minutes to maintain energy.",
  },
  // Advanced — paragraph (long, with numbers, symbols, punctuation)
  {
    level: "advanced",
    category: "paragraph",
    title: "Science & Numbers",
    content:
      "The speed of light in a vacuum is approximately 299,792,458 m/s — a constant denoted by 'c' in Einstein's famous equation E = mc^2. At that velocity, light travels roughly 9.461 × 10^15 metres per year (one light-year). The observable universe spans ~93 billion light-years in diameter, yet its age is only 13.8 billion years. How can this be? The answer lies in the expansion of space itself: galaxies aren't moving through space; space is stretching between them, carrying galaxies along for the ride.",
  },
  {
    level: "advanced",
    category: "paragraph",
    title: "Tech & Finance",
    content:
      "In Q3 2025, the S&P 500 gained 7.4% (YTD: +18.2%), while 10-year Treasury yields hovered around 4.35%. Cloud-infrastructure spending topped $78B globally — AWS held 32% market share, Azure 23%, and GCP 11%. Meanwhile, the average DevOps team deploys ~200 times/day with a change-failure rate below 5%. For context: a 99.99% SLA allows just ~52 minutes of downtime per year. Monitoring latency at p99 (not just mean) is critical; a 2× slowdown at the tail can erode user satisfaction by up to 30% according to Google's 2024 UX research.",
  },
  // Advanced — coding
  {
    level: "advanced",
    category: "coding",
    title: "JavaScript Snippet",
    content:
      "const sum = (arr) => arr.reduce((acc, n) => acc + n, 0);\nconst doubled = [1, 2, 3].map((x) => x * 2);\nconsole.log(sum(doubled));",
  },
  {
    level: "advanced",
    category: "coding",
    title: "Python Function",
    content:
      "def fibonacci(n):\n    a, b = 0, 1\n    for _ in range(n):\n        a, b = b, a + b\n    return a\n\nprint([fibonacci(i) for i in range(10)])",
  },
  {
    level: "advanced",
    category: "coding",
    title: "TypeScript Generics",
    content:
      "function pluck<T, K extends keyof T>(items: T[], key: K): T[K][] {\n  return items.map((item) => item[key]);\n}",
  },
];

async function main() {
  console.log("→ Seeding lessons (clearing existing first)...");
  await db.delete(schema.lesson);
  for (let i = 0; i < lessons.length; i++) {
    const l = lessons[i];
    await db.insert(schema.lesson).values({
      id: randomUUID(),
      level: l.level,
      category: l.category,
      title: l.title,
      content: l.content,
      orderIndex: i,
    });
  }
  console.log(`✓ Seeded ${lessons.length} lessons`);

  const adminEmail = process.env.ADMIN_EMAIL;
  if (adminEmail) {
    const result = await db
      .update(schema.user)
      .set({ role: "admin" })
      .where(eq(schema.user.email, adminEmail))
      .returning({ id: schema.user.id });
    if (result.length) {
      console.log(`✓ Promoted ${adminEmail} to admin`);
    } else {
      console.log(
        `ℹ ${adminEmail} not found yet — sign up first, then re-run db:seed to promote.`,
      );
    }
  }

  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
