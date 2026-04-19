"use client";

import type { ReactNode } from "react";

import { SiteNavbar } from "@/components/layout/site-navbar";
import { AppNavbar } from "@/components/layout/app-navbar";
import { SiteFooter } from "@/components/landing/footer";
import { authClient } from "@/lib/auth-client";

/**
 * Used for pages that are publicly accessible (practice, lessons) but should
 * show the app navbar + no footer when the user is signed in, or the landing
 * navbar + footer when the user is a guest.
 */
export function PublicPageLayout({ children }: { children: ReactNode }) {
  const { data: session, isPending } = authClient.useSession();

  // While auth state is loading, render the landing navbar (safest default —
  // avoids flashing app links to unauthenticated users).
  const isSignedIn = !isPending && !!session;

  return (
    <div className="flex min-h-svh flex-col">
      {isSignedIn ? <AppNavbar /> : <SiteNavbar />}
      <main className="flex-1">{children}</main>
      {!isSignedIn && <SiteFooter />}
    </div>
  );
}
