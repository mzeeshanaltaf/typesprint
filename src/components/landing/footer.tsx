import Link from "next/link";
import { Zap } from "lucide-react";

const links = {
  Product: [
    { label: "Features", href: "/#features" },
    { label: "Pricing", href: "/#pricing" },
    { label: "Lessons", href: "/lessons" },
    { label: "Practice", href: "/practice" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  Legal: [
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
  ],
};

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-muted/20">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-14 md:grid-cols-[1.4fr_repeat(3,1fr)] md:px-6">
        <div className="flex flex-col gap-4">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span className="grid size-8 place-items-center rounded-lg bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white">
              <Zap className="size-4" />
            </span>
            TypeSprint
          </Link>
          <p className="max-w-sm text-sm text-muted-foreground">
            A focused typing tutor for learners who want measurable progress —
            not gimmicks.
          </p>
        </div>

        {Object.entries(links).map(([title, items]) => (
          <div key={title} className="flex flex-col gap-3">
            <h4 className="text-sm font-semibold">{title}</h4>
            <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
              {items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border/60">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-2 px-4 py-6 text-xs text-muted-foreground md:flex-row md:px-6">
          <span>© {new Date().getFullYear()} TypeSprint. All rights reserved.</span>
          <span>Built with Next.js, Tailwind, and shadcn/ui.</span>
        </div>
      </div>
    </footer>
  );
}
