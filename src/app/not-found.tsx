import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60svh] w-full max-w-md flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        404
      </p>
      <h2 className="text-2xl font-semibold tracking-tight">Page not found</h2>
      <p className="text-sm text-muted-foreground">
        That page doesn&apos;t exist — or it moved.
      </p>
      <div className="flex gap-2">
        <Button asChild variant="outline">
          <Link href="/lessons">Browse lessons</Link>
        </Button>
        <Button asChild>
          <Link href="/">Back home</Link>
        </Button>
      </div>
    </div>
  );
}
