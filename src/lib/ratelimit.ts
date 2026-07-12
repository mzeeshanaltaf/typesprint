import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

/**
 * Per-IP rate limiter for the contact form.
 *
 * Only instantiated when the Upstash credentials are present so the app still
 * builds/runs in environments where they are not configured (in that case the
 * limiter is simply skipped).
 */
const hasUpstash =
  !!process.env.UPSTASH_REDIS_REST_URL &&
  !!process.env.UPSTASH_REDIS_REST_TOKEN;

export const contactRatelimit = hasUpstash
  ? new Ratelimit({
      redis: Redis.fromEnv(),
      // 5 submissions per IP per 10 minutes.
      limiter: Ratelimit.slidingWindow(5, "10 m"),
      prefix: "ratelimit:contact",
      analytics: true,
    })
  : null;

/** Best-effort client IP extraction from proxy headers. */
export function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return req.headers.get("x-real-ip")?.trim() || "127.0.0.1";
}
