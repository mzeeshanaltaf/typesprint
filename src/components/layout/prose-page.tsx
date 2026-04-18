import type { ReactNode } from "react";
import { SiteNavbar } from "@/components/layout/site-navbar";
import { SiteFooter } from "@/components/landing/footer";

export function ProsePage({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-svh flex-col">
      <SiteNavbar />
      <main className="flex-1">
        <div className="mx-auto w-full max-w-3xl px-4 py-16 md:px-6 md:py-24">
          <header className="mb-12 border-b border-border/60 pb-8">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              {eyebrow}
            </p>
            <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-3 text-base text-muted-foreground">{subtitle}</p>
            )}
          </header>
          <div className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-a:text-indigo-500 prose-a:no-underline hover:prose-a:underline prose-strong:text-foreground">
            {children}
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
