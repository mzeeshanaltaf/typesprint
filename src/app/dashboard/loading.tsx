import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 md:px-6 md:py-14">
      <div className="mb-8 flex flex-col gap-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-9 w-64" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="border-border/60 bg-card/60">
            <CardContent className="flex flex-col gap-2 p-6">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-8 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Skeleton className="h-72 w-full rounded-xl" />
        <Skeleton className="h-72 w-full rounded-xl" />
      </div>
    </div>
  );
}
