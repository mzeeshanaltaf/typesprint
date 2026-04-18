"use client";

import { Button } from "@/components/ui/button";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center gap-4 py-20 text-center">
      <h2 className="text-xl font-semibold">Something went wrong</h2>
      <p className="text-sm text-muted-foreground">
        {error.message || "Failed to load your dashboard."}
      </p>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
