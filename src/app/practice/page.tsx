import type { Metadata } from "next";

import { PublicPageLayout } from "@/components/layout/public-page-layout";
import { PracticeShell } from "@/components/typing/practice-shell";

export const metadata: Metadata = {
  title: "Free Typing Test — Measure WPM and Accuracy",
  description:
    "Take a free typing test in 15, 30, or 60 seconds. See your real-time words per minute and accuracy. No sign-up required to try a sprint.",
  alternates: {
    canonical: "/practice",
  },
};

export default function PracticePage() {
  return (
    <PublicPageLayout>
      <div className="mx-auto w-full max-w-4xl px-4 py-12 md:px-6 md:py-16">
        <header className="mb-8 flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Practice
          </p>
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Free typing test — measure your WPM and accuracy
          </h1>
          <p className="text-muted-foreground md:text-lg">
            Pick a duration, type the text, see your WPM and accuracy. Sign in
            to save your results.
          </p>
        </header>
        <PracticeShell />
      </div>
    </PublicPageLayout>
  );
}
