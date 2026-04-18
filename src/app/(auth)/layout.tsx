import Link from "next/link";
import { Zap } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-background px-4 py-12">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,oklch(0.55_0.22_265/0.18),transparent_70%),radial-gradient(ellipse_60%_50%_at_80%_100%,oklch(0.65_0.20_30/0.15),transparent_70%)] dark:bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,oklch(0.55_0.22_265/0.30),transparent_70%),radial-gradient(ellipse_60%_50%_at_80%_100%,oklch(0.65_0.20_30/0.20),transparent_70%)]" />
      <Link
        href="/"
        className="mb-8 flex items-center gap-2 text-lg font-semibold tracking-tight"
      >
        <span className="grid size-8 place-items-center rounded-lg bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white">
          <Zap className="size-4" />
        </span>
        TypeSprint
      </Link>
      {children}
    </div>
  );
}
