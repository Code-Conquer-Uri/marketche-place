import { Skeleton } from "@/components/ui/skeleton";

export const OrganizationItemSkeleton = () => {
  return (
    <div className="flex h-40 w-full items-center justify-center bg-muted">
      <Skeleton className="h-[5.125rem] w-[13.375rem]" />
    </div>
  );
};
