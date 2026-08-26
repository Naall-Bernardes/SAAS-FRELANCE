import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <div>
        <Skeleton className="h-6 w-40" />
        <Skeleton className="mt-2 h-4 w-72" />
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-border bg-surface p-4">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="mt-2 h-7 w-16" />
            <Skeleton className="mt-2 h-3 w-24" />
          </div>
        ))}
      </div>

      <Skeleton className="h-64 w-full rounded-2xl" />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <Skeleton className="h-56 rounded-2xl lg:col-span-3" />
        <Skeleton className="h-56 rounded-2xl lg:col-span-2" />
      </div>
    </div>
  );
}
