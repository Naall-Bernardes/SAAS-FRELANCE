import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <div>
        <Skeleton className="h-6 w-72" />
        <Skeleton className="mt-2 h-4 w-full max-w-lg" />
      </div>
      <Skeleton className="h-[900px] rounded-2xl" />
    </div>
  );
}
