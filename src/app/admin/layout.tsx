import type { Metadata } from "next";
import Link from "next/link";
import { BarChart3, BookOpen, Users } from "lucide-react";

import { SiteNavbar } from "@/components/layout/site-navbar";
import { SiteFooter } from "@/components/landing/footer";
import { requireAdmin } from "@/lib/admin";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

const navItems = [
  { href: "/admin/lessons", label: "Lessons", icon: BookOpen },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();
  return (
    <div className="flex min-h-svh flex-col">
      <SiteNavbar />
      <main className="flex-1">
        <div className="mx-auto w-full max-w-7xl px-4 py-10 md:px-6 md:py-14">
          <header className="mb-8 flex flex-col gap-2">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Admin
            </p>
            <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
              Control room
            </h1>
          </header>
          <div className="grid gap-8 md:grid-cols-[220px_1fr]">
            <aside>
              <nav className="flex flex-col gap-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <item.icon className="size-4" />
                    {item.label}
                  </Link>
                ))}
              </nav>
            </aside>
            <div>{children}</div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
