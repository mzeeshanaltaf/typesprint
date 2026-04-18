import "server-only";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/sign-in?callbackUrl=/admin");
  const role = (session.user as { role?: string }).role;
  if (role !== "admin") redirect("/");
  return session;
}
