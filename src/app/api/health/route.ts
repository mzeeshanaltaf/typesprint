import { NextResponse } from "next/server";

// Lightweight liveness probe for the container health check (Coolify/Traefik).
// Kept dependency-free (no DB/network) so it stays fast and can't flap.
export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json({ status: "ok" }, { status: 200 });
}
