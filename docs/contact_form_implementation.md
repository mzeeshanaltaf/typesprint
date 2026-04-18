# Contact Form Implementation Guide

This document captures the exact pattern used in Greetify so the same feature can be replicated in another Next.js 16 + React 19 App Router project on the first attempt, without hitting the hydration failures that took multiple iterations to resolve.

---

## Why This Pattern Exists

Next.js 16 + React 19 can silently abandon client-side hydration on a route with no console errors. When this happens:

- `useEffect` never fires
- Button `onClick` / form `onSubmit` handlers never attach
- The page looks fully rendered but all interactivity is dead
- Clearing `.next` cache does not reliably fix it

**Diagnostic:** Add this to the client component and open the browser console:
```tsx
useEffect(() => {
  console.log("[ContactForm] mounted – React hydration OK");
}, []);
```
If this log never appears, hydration has failed. Apply the progressive enhancement pattern described below.

---

## The Three-Part Pattern

The fix is **progressive enhancement**: the form works as a plain HTML POST even if React never hydrates, and uses `fetch` when React is alive.

### Part 1 — API Route handles both submission paths

`src/app/api/contact/route.ts`

```ts
import { NextRequest, NextResponse } from "next/server";

const WEBHOOK_URL = "https://your-n8n-or-webhook-url/webhook/your-id";
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function parseBody(req: NextRequest): Promise<{ name: string; email: string; message: string }> {
  const ct = req.headers.get("content-type") ?? "";
  // Native HTML form POST sends application/x-www-form-urlencoded
  if (ct.includes("application/x-www-form-urlencoded") || ct.includes("multipart/form-data")) {
    const fd = await req.formData();
    return {
      name: (fd.get("name") as string | null) ?? "",
      email: (fd.get("email") as string | null) ?? "",
      message: (fd.get("message") as string | null) ?? "",
    };
  }
  // React fetch path sends application/json
  const body = await req.json();
  return {
    name: body.name ?? "",
    email: body.email ?? "",
    message: body.message ?? "",
  };
}

export async function POST(req: NextRequest) {
  const isFormPost =
    (req.headers.get("content-type") ?? "").includes("application/x-www-form-urlencoded") ||
    (req.headers.get("content-type") ?? "").includes("multipart/form-data");

  let name: string, email: string, message: string;
  try {
    ({ name, email, message } = await parseBody(req));
  } catch (err) {
    console.error("[contact] parse error:", err);
    if (isFormPost) return NextResponse.redirect(new URL("/contact?error=parse", req.url), 303);
    return NextResponse.json({ success: false, message: "Invalid request body." }, { status: 400 });
  }

  const n = name.trim(), em = email.trim(), msg = message.trim();

  if (!n || !em || !msg) {
    if (isFormPost) return NextResponse.redirect(new URL("/contact?error=fields", req.url), 303);
    return NextResponse.json({ success: false, message: "All fields are required." }, { status: 400 });
  }
  if (!EMAIL_REGEX.test(em)) {
    if (isFormPost) return NextResponse.redirect(new URL("/contact?error=email", req.url), 303);
    return NextResponse.json({ success: false, message: "Invalid email address." }, { status: 400 });
  }
  if (msg.length > 1000) {
    if (isFormPost) return NextResponse.redirect(new URL("/contact?error=length", req.url), 303);
    return NextResponse.json({ success: false, message: "Message must be 1000 characters or fewer." }, { status: 400 });
  }

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.N8N_API_KEY ?? "",
      },
      body: JSON.stringify({ name: n, email: em, message: msg }),
    });

    const data = await response.json();
    if (isFormPost) {
      if (data.success) return NextResponse.redirect(new URL("/contact?sent=1", req.url), 303);
      return NextResponse.redirect(new URL("/contact?error=webhook", req.url), 303);
    }
    return NextResponse.json(data);
  } catch (err) {
    console.error("[contact] webhook error:", err);
    if (isFormPost) return NextResponse.redirect(new URL("/contact?error=server", req.url), 303);
    return NextResponse.json({ success: false, message: "Internal server error. Please try again later." }, { status: 500 });
  }
}
```

**Key rules:**
- Always detect `isFormPost` via `content-type` header — do not trust any other signal.
- For native POST failures, **always redirect with `303 See Other`** (not 200/400/500). This is the POST→GET redirect pattern; without it the browser will show a blank page or re-submit the form on refresh.
- For JSON failures, return `NextResponse.json(...)` with the appropriate status code.
- The webhook (n8n or similar) must return `{ success: true }` on success for the JSON path check to work.

---

### Part 2 — Page server component reads `searchParams`

`src/app/contact/page.tsx`

```tsx
import type { Metadata } from "next";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import ContactForm from "@/components/landing/ContactForm";

export const metadata: Metadata = {
  title: "Contact Us — Your App",
  description: "Get in touch with our team.",
};

const ERROR_MESSAGES: Record<string, string> = {
  fields: "Please fill in all fields.",
  email: "Please enter a valid email address.",
  length: "Message must be 1000 characters or fewer.",
  webhook: "Something went wrong. Please try again.",
  server: "Internal server error. Please try again later.",
  parse: "Invalid submission. Please try again.",
};

interface Props {
  searchParams: Promise<{ sent?: string; error?: string }>;
}

export default async function ContactPage({ searchParams }: Props) {
  const { sent, error } = await searchParams;
  const initialError = error
    ? (ERROR_MESSAGES[error] ?? "Something went wrong. Please try again.")
    : undefined;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="pt-16">
        <div className="max-w-xl mx-auto px-6 py-20">
          <ContactForm initialSuccess={!!sent} initialError={initialError} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
```

**Key rules:**
- This is a **server component** (no `"use client"`). It `await`s `searchParams` — in Next.js 15+, `searchParams` is a Promise.
- Pass `initialSuccess` and `initialError` as props — the client component sets its initial state from these, so the native POST path shows correct feedback without React needing to be hydrated.
- Do NOT use `useSearchParams()` in a client component for this — that requires a Suspense boundary and is unreliable when hydration fails.

---

### Part 3 — Client form component with dual submission

`src/components/landing/ContactForm.tsx`

```tsx
"use client";

import { useState, useEffect } from "react";
import { User, Mail, MessageSquare, Send, Loader2, CheckCircle, AlertCircle } from "lucide-react";

interface Props {
  initialSuccess?: boolean;
  initialError?: string;
}

export default function ContactForm({ initialSuccess = false, initialError }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    initialSuccess ? "success" : initialError ? "error" : "idle"
  );
  const [errorMsg, setErrorMsg] = useState(initialError ?? "");

  // Hydration diagnostic — remove in production if desired
  useEffect(() => {
    console.log("[ContactForm] mounted – React hydration OK");
  }, []);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault(); // takes over from native POST when React is alive

    const n = name.trim();
    const em = email.trim();
    const msg = message.trim();

    if (!n || !em || !msg) {
      setStatus("error");
      setErrorMsg("Please fill in all fields.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) {
      setStatus("error");
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: n, email: em, message: msg }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus("success");
      } else {
        setStatus("error");
        setErrorMsg(data.message ?? "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setErrorMsg("Failed to send message. Please check your connection and try again.");
    }
  };

  if (status === "success") {
    return (
      <div className="flex flex-col items-center text-center py-12">
        <div className="w-16 h-16 rounded-full bg-green-50 border border-green-200 flex items-center justify-center mb-5">
          <CheckCircle className="w-8 h-8 text-green-500" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Message Sent!</h2>
        <p className="text-gray-500 mb-8">
          Your message has been received. We'll get back to you as soon as possible.
        </p>
        <a
          href="/"
          className="px-6 py-2.5 rounded-full bg-linear-to-r from-amber-500 to-amber-600 text-white text-sm font-bold hover:opacity-90 transition-opacity"
        >
          Back to Home
        </a>
      </div>
    );
  }

  return (
    <form
      action="/api/contact"   {/* ← native POST fallback when React fails to hydrate */}
      method="post"           {/* ← must be "post", not "POST" (HTML spec) */}
      onSubmit={handleSubmit} {/* ← React path: e.preventDefault() intercepts */}
      noValidate             {/* ← disable browser's built-in validation; we validate in JS */}
      className="flex flex-col items-center text-sm"
    >
      <h1 className="text-4xl font-bold py-4 text-center">Let's Get In Touch.</h1>

      <div className="w-full">
        {/* Full Name */}
        <label htmlFor="contact-name" className="font-semibold">Full Name</label>
        <div className="flex items-center mt-2 mb-4 h-11 pl-3 border rounded-full bg-white">
          <User className="w-4 h-4 text-gray-400 shrink-0" />
          <input
            id="contact-name"
            name="name"          {/* ← name attribute is required for native POST */}
            type="text"
            maxLength={100}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-full px-3 w-full outline-none bg-transparent"
            placeholder="Enter your full name"
            autoComplete="name"
          />
        </div>

        {/* Email */}
        <label htmlFor="contact-email" className="font-semibold">Email Address</label>
        <div className="flex items-center mt-2 mb-4 h-11 pl-3 border rounded-full bg-white">
          <Mail className="w-4 h-4 text-gray-400 shrink-0" />
          <input
            id="contact-email"
            name="email"         {/* ← name attribute is required for native POST */}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-full px-3 w-full outline-none bg-transparent"
            placeholder="Enter your email address"
            autoComplete="email"
          />
        </div>

        {/* Message */}
        <label htmlFor="contact-message" className="font-semibold">Message</label>
        <div className="flex mt-2 mb-1 p-3 border rounded-2xl bg-white">
          <MessageSquare className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
          <textarea
            id="contact-message"
            name="message"       {/* ← name attribute is required for native POST */}
            rows={4}
            maxLength={1000}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full px-3 bg-transparent outline-none resize-none"
            placeholder="Enter your message"
          />
        </div>
        <div className="flex justify-end mb-4">
          <span className={`text-[10px] ${message.length >= 900 ? "text-red-400" : "text-gray-300"}`}>
            {message.length}/1000
          </span>
        </div>

        {/* Error banner */}
        {status === "error" && (
          <div className="flex items-start gap-2 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs mb-4">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={status === "loading"}
          className="flex items-center justify-center gap-2 mt-1 w-full py-3 rounded-full bg-linear-to-r from-amber-500 to-amber-600 text-white font-bold text-sm hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
        >
          {status === "loading" ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Sending…
            </>
          ) : (
            <>
              Submit Form
              <Send className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
```

**Key rules — inputs MUST have `name` attributes.** Without `name`, the native HTML POST sends empty fields. This is the most common silent bug when converting a React-only form to progressive enhancement.

---

## Environment Variables

Add to `.env.local`:

```
N8N_API_KEY=your_n8n_api_key_here
```

The webhook URL is hardcoded in the route (not an env var) in this implementation, but you can move it to `process.env.CONTACT_WEBHOOK_URL` if preferred.

---

## File Structure Summary

```
src/
  app/
    contact/
      page.tsx              ← server component; reads searchParams; passes props to form
    api/
      contact/
        route.ts            ← POST handler; dual-path (JSON + form-encoded); 303 redirects
  components/
    landing/
      ContactForm.tsx       ← "use client"; dual submission (onSubmit + action/method)
```

---

## Common Mistakes to Avoid

| Mistake | Why it fails |
|---|---|
| Only `onSubmit`, no `action`/`method` | If hydration fails, form does nothing on submit |
| Only `action`/`method`, no `onSubmit` | Works, but full page reload on every submission; no loading state |
| `method="POST"` (uppercase) | HTML spec requires lowercase `post`; some browsers reject it |
| Inputs without `name` attribute | Native POST sends empty string for those fields |
| API route returns 400 for form errors | Browser shows raw JSON; must redirect 303 instead |
| `useSearchParams()` in client component | Requires Suspense; breaks when hydration fails; use server component `searchParams` prop instead |
| `dynamic(() => import(...), { ssr: false })` on the form | Can introduce a different hydration root that never mounts; the dual-submission pattern above is safer |
| Checking webhook success on HTTP status only | n8n returns 200 even for some error cases; check `data.success` in the response body |
