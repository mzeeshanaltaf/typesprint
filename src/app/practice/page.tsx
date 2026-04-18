import type { Metadata } from "next";

import { SiteNavbar } from "@/components/layout/site-navbar";
import { SiteFooter } from "@/components/landing/footer";
import { PracticeShell } from "@/components/typing/practice-shell";

export const metadata: Metadata = {
  title: "Practice",
  description:
    "Run a free typing sprint — 15, 30, or 60 seconds. Real-time WPM and accuracy.",
};

export default function PracticePage() {
  return (
    <div className="flex min-h-svh flex-col">
      <SiteNavbar />
      <main className="flex-1">
        <div className="mx-auto w-full max-w-4xl px-4 py-12 md:px-6 md:py-16">
          <header className="mb-8 flex flex-col gap-2">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Practice
            </p>
            <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
              Free-form typing sprint
            </h1>
            <p className="text-muted-foreground md:text-lg">
              Pick a duration, type the text, see your WPM and accuracy. Sign in
              to save your results.
            </p>
          </header>
          <PracticeShell />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
