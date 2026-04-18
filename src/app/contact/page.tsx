import type { Metadata } from "next";

import { SiteNavbar } from "@/components/layout/site-navbar";
import { SiteFooter } from "@/components/landing/footer";
import { ContactForm } from "@/components/contact/contact-form";

export const metadata: Metadata = {
  title: "Contact — TypeSprint",
  description:
    "Get in touch with the TypeSprint team. Questions, feedback, or partnership requests — we read every message.",
};

const ERROR_MESSAGES: Record<string, string> = {
  fields: "Please fill in all fields.",
  email: "Please enter a valid email address.",
  length: "Message must be 1000 characters or fewer.",
  webhook: "Something went wrong. Please try again.",
  server: "Internal server error. Please try again later.",
  parse: "Invalid submission. Please try again.",
};

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ sent?: string; error?: string }>;
}) {
  const { sent, error } = await searchParams;
  const initialError = error
    ? (ERROR_MESSAGES[error] ?? "Something went wrong. Please try again.")
    : undefined;

  return (
    <div className="flex min-h-svh flex-col">
      <SiteNavbar />
      <main className="flex-1">
        <div className="mx-auto w-full max-w-2xl px-4 py-16 md:px-6 md:py-24">
          <header className="mb-10 flex flex-col gap-2">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Contact
            </p>
            <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
              Let&apos;s get in touch
            </h1>
            <p className="text-base text-muted-foreground">
              Questions, feedback, or partnership ideas — drop us a line and
              we&apos;ll get back to you.
            </p>
          </header>
          <ContactForm initialSuccess={!!sent} initialError={initialError} />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
