import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <div>
        <Skeleton className="h-6 w-56" />
        <Skeleton className="mt-2 h-4 w-96" />
      </div>
      <div className="flex flex-col gap-6 lg:flex-row">
        <Skeleton className="hidden h-96 w-64 shrink-0 rounded-2xl lg:block" />
        <div className="min-w-0 flex-1 space-y-4">
          <Skeleton className="h-10 w-full rounded-lg" />
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-56 rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
