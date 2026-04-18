import { Skeleton } from "@/components/ui/skeleton";

export default function LessonsLoading() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 md:px-6 md:py-14">
      <div className="mb-8 flex flex-col gap-2">
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>
      <div className="flex flex-col gap-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-3">
            <Skeleton className="h-5 w-32" />
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, j) => (
                <Skeleton key={j} className="h-28 w-full rounded-xl" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
