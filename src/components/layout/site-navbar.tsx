"use client";

import Link from "next/link";
import { Zap, Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/#features", label: "Features" },
  { href: "/#how", label: "How it works" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/#faq", label: "FAQ" },
];

function scrollToHash(href: string) {
  const id = href.replace("/#", "");
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

export function SiteNavbar() {
  const { data: session, isPending } = authClient.useSession();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full border-b border-transparent transition-all",
        scrolled &&
          "border-border/60 bg-background/80 backdrop-blur supports-backdrop-filter:bg-background/60",
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="grid size-8 place-items-center rounded-lg bg-linear-to-br from-indigo-500 to-fuchsia-500 text-white">
            <Zap className="size-4" />
          </span>
          TypeSprint
        </Link>

        <nav className="hidden items-center gap-8 text-sm md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-muted-foreground transition-colors hover:text-foreground"
              onClick={
                pathname === "/"
                  ? (e) => { e.preventDefault(); scrollToHash(item.href); }
                  : undefined
              }
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {!isPending && session ? (
            <Button asChild size="sm" className="hidden md:inline-flex">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="hidden md:inline-flex"
              >
                <Link href="/sign-in">Sign in</Link>
              </Button>
              <Button asChild size="sm" className="hidden md:inline-flex">
                <Link href="/sign-up">Get started</Link>
              </Button>
            </>
          )}

          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label="Open menu"
              >
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle>TypeSprint</SheetTitle>
              </SheetHeader>
              <nav className="mt-6 flex flex-col gap-4 px-4 text-base">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                    onClick={
                      pathname === "/"
                        ? (e) => { e.preventDefault(); scrollToHash(item.href); }
                        : undefined
                    }
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="mt-4 flex flex-col gap-2">
                  {session ? (
                    <Button asChild>
                      <Link href="/dashboard">Dashboard</Link>
                    </Button>
                  ) : (
                    <>
                      <Button asChild variant="outline">
                        <Link href="/sign-in">Sign in</Link>
                      </Button>
                      <Button asChild>
                        <Link href="/sign-up">Get started</Link>
                      </Button>
                    </>
                  )}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
