"use client";

import { Button } from "@/components/ui/button";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-start gap-4 py-10">
      <h2 className="text-xl font-semibold">Admin error</h2>
      <p className="text-sm text-muted-foreground">
        {error.message || "Something went wrong."}
      </p>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
