"use client";

import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto flex min-h-[60svh] w-full max-w-md flex-col items-center justify-center gap-4 px-4 text-center">
      <h2 className="text-2xl font-semibold tracking-tight">
        Something went wrong
      </h2>
      <p className="text-sm text-muted-foreground">
        {error.message || "An unexpected error occurred."}
      </p>
      <div className="flex gap-2">
        <Button variant="outline" onClick={() => (window.location.href = "/")}>
          Home
        </Button>
        <Button onClick={reset}>Try again</Button>
      </div>
    </div>
  );
}
