import { NextRequest, NextResponse } from "next/server";

import { contactRatelimit, getClientIp } from "@/lib/ratelimit";

const WEBHOOK_URL =
  "https://n8n.zeeshanai.cloud/webhook/bac41859-89f0-4720-b3cd-37328cfbfce1";
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Honeypot field: an off-screen input that real users never see or fill.
// Its name is deliberately non-descriptive so browser/Google autofill leaves
// it empty — any non-empty value means an automated submission.
const HONEYPOT_FIELD = "contact_time";

async function parseBody(
  req: NextRequest,
): Promise<{
  name: string;
  email: string;
  message: string;
  honeypot: string;
}> {
  const ct = req.headers.get("content-type") ?? "";
  if (
    ct.includes("application/x-www-form-urlencoded") ||
    ct.includes("multipart/form-data")
  ) {
    const fd = await req.formData();
    return {
      name: (fd.get("name") as string | null) ?? "",
      email: (fd.get("email") as string | null) ?? "",
      message: (fd.get("message") as string | null) ?? "",
      honeypot: (fd.get(HONEYPOT_FIELD) as string | null) ?? "",
    };
  }
  const body = await req.json();
  return {
    name: body.name ?? "",
    email: body.email ?? "",
    message: body.message ?? "",
    honeypot: body[HONEYPOT_FIELD] ?? "",
  };
}

export async function POST(req: NextRequest) {
  const ct = req.headers.get("content-type") ?? "";
  const isFormPost =
    ct.includes("application/x-www-form-urlencoded") ||
    ct.includes("multipart/form-data");

  // Per-IP rate limiting (skipped if Upstash isn't configured).
  if (contactRatelimit) {
    const ip = getClientIp(req);
    const { success } = await contactRatelimit.limit(ip);
    if (!success) {
      if (isFormPost)
        return NextResponse.redirect(
          new URL("/contact?error=rate", req.url),
          303,
        );
      return NextResponse.json(
        {
          success: false,
          message: "Too many requests. Please try again in a few minutes.",
        },
        { status: 429 },
      );
    }
  }

  let name: string, email: string, message: string, honeypot: string;
  try {
    ({ name, email, message, honeypot } = await parseBody(req));
  } catch (err) {
    console.error("[contact] parse error:", err);
    if (isFormPost)
      return NextResponse.redirect(
        new URL("/contact?error=parse", req.url),
        303,
      );
    return NextResponse.json(
      { success: false, message: "Invalid request body." },
      { status: 400 },
    );
  }

  // Honeypot tripped — silently accept so the bot thinks it succeeded, but
  // never forward the submission.
  if (honeypot.trim()) {
    console.warn("[contact] honeypot triggered, dropping submission");
    if (isFormPost)
      return NextResponse.redirect(new URL("/contact?sent=1", req.url), 303);
    return NextResponse.json({ success: true });
  }

  const n = name.trim();
  const em = email.trim();
  const msg = message.trim();

  if (!n || !em || !msg) {
    if (isFormPost)
      return NextResponse.redirect(
        new URL("/contact?error=fields", req.url),
        303,
      );
    return NextResponse.json(
      { success: false, message: "All fields are required." },
      { status: 400 },
    );
  }
  if (!EMAIL_REGEX.test(em)) {
    if (isFormPost)
      return NextResponse.redirect(
        new URL("/contact?error=email", req.url),
        303,
      );
    return NextResponse.json(
      { success: false, message: "Invalid email address." },
      { status: 400 },
    );
  }
  if (msg.length > 1000) {
    if (isFormPost)
      return NextResponse.redirect(
        new URL("/contact?error=length", req.url),
        303,
      );
    return NextResponse.json(
      { success: false, message: "Message must be 1000 characters or fewer." },
      { status: 400 },
    );
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

    const data = await response.json().catch(() => ({ success: false }));

    if (isFormPost) {
      if (data.success)
        return NextResponse.redirect(
          new URL("/contact?sent=1", req.url),
          303,
        );
      return NextResponse.redirect(
        new URL("/contact?error=webhook", req.url),
        303,
      );
    }
    return NextResponse.json(data);
  } catch (err) {
    console.error("[contact] webhook error:", err);
    if (isFormPost)
      return NextResponse.redirect(
        new URL("/contact?error=server", req.url),
        303,
      );
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error. Please try again later.",
      },
      { status: 500 },
    );
  }
}
