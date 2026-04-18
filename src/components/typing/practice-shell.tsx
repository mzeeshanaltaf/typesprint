"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

const PracticeClient = dynamic(
  () =>
    import("@/components/typing/practice-client").then((m) => ({
      default: m.PracticeClient,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-72 w-full" />
      </div>
    ),
  },
);

export function PracticeShell() {
  return <PracticeClient />;
}
