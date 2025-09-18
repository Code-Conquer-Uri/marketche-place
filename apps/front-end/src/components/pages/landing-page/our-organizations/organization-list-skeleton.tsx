import { Skeleton } from "@/components/ui/skeleton";

export const OrganizationListSkeleton = () => {
  return (
    <div className="grid gap-1 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          // biome-ignore lint/suspicious/noArrayIndexKey: Skeleton
          key={index}
          className="flex h-40 w-full items-center justify-center bg-muted transition-all hover:bg-accent hover:shadow-inner"
        >
          <div className="h-[5.125rem] w-[13.375rem]">
            <Skeleton className="h-full w-full" />
          </div>
        </div>
      ))}
    </div>
  );
};
