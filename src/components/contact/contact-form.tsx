"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  Mail,
  MessageSquare,
  Send,
  User,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type Status = "idle" | "loading" | "success" | "error";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MESSAGE_MAX = 1000;

export function ContactForm({
  initialSuccess = false,
  initialError,
}: {
  initialSuccess?: boolean;
  initialError?: string;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>(
    initialSuccess ? "success" : initialError ? "error" : "idle",
  );
  const [errorMsg, setErrorMsg] = useState(initialError ?? "");

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();

    const n = name.trim();
    const em = email.trim();
    const msg = message.trim();

    if (!n || !em || !msg) {
      setStatus("error");
      setErrorMsg("Please fill in all fields.");
      return;
    }
    if (!EMAIL_REGEX.test(em)) {
      setStatus("error");
      setErrorMsg("Please enter a valid email address.");
      return;
    }
    if (msg.length > MESSAGE_MAX) {
      setStatus("error");
      setErrorMsg(`Message must be ${MESSAGE_MAX} characters or fewer.`);
      return;
    }

    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: n, email: em, message: msg }),
      });
      const data = await res.json().catch(() => ({ success: false }));
      if (data.success) {
        setStatus("success");
      } else {
        setStatus("error");
        setErrorMsg(
          data.message ?? "Something went wrong. Please try again.",
        );
      }
    } catch {
      setStatus("error");
      setErrorMsg(
        "Failed to send message. Please check your connection and try again.",
      );
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center gap-5 rounded-2xl border border-border/60 bg-card/60 px-6 py-16 text-center">
        <div className="grid size-14 place-items-center rounded-full bg-emerald-500/10 text-emerald-500 ring-1 ring-emerald-500/30">
          <CheckCircle2 className="size-7" />
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-semibold tracking-tight">
            Message sent
          </h2>
          <p className="max-w-sm text-sm text-muted-foreground">
            Thanks for reaching out. We&apos;ll reply to the email you provided
            as soon as possible.
          </p>
        </div>
        <Button asChild>
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    );
  }

  const count = message.length;

  return (
    <form
      action="/api/contact"
      method="post"
      onSubmit={handleSubmit}
      noValidate
      className="flex flex-col gap-5 rounded-2xl border border-border/60 bg-card/60 p-6 md:p-8"
    >
      <div className="flex flex-col gap-2">
        <Label htmlFor="contact-name">Full name</Label>
        <div className="relative">
          <User className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="contact-name"
            name="name"
            type="text"
            maxLength={100}
            autoComplete="name"
            placeholder="Jane Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="pl-9"
            required
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="contact-email">Email address</Label>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-9"
            required
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="contact-message">Message</Label>
        <div className="relative">
          <MessageSquare className="pointer-events-none absolute left-3 top-3 size-4 text-muted-foreground" />
          <textarea
            id="contact-message"
            name="message"
            rows={6}
            maxLength={MESSAGE_MAX}
            placeholder="Tell us what's on your mind..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex min-h-28 w-full resize-y rounded-md border border-input bg-transparent py-2 pl-9 pr-3 text-sm shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 dark:bg-input/30"
            required
          />
        </div>
        <div className="flex justify-end">
          <span
            className={cn(
              "text-xs tabular-nums text-muted-foreground",
              count >= MESSAGE_MAX - 100 && "text-amber-500",
              count >= MESSAGE_MAX && "text-destructive",
            )}
          >
            {count}/{MESSAGE_MAX}
          </span>
        </div>
      </div>

      {status === "error" && errorMsg && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <Button
        type="submit"
        disabled={status === "loading"}
        className="gap-2"
        size="lg"
      >
        {status === "loading" ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <Send className="size-4" />
            Send message
          </>
        )}
      </Button>
    </form>
  );
}
