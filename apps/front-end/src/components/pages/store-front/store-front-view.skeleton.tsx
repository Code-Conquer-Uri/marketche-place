import { Skeleton } from "@/components/ui/skeleton";

export function StoreFrontViewSkeleton() {
  return (
    <div className="space-y-10">
      <Skeleton className="h-60 w-full rounded-xl" />
      <div className="space-y-4">
        <Skeleton className="h-6 w-40" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map(() => (
            <div key={crypto.randomUUID()} className="space-y-3">
              <Skeleton className="aspect-square w-full rounded-md" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
