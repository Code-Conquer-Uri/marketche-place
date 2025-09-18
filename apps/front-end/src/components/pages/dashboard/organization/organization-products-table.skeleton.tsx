import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function OrganizationProductsTableSkeleton() {
  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <div className="flex justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-9 w-40" />
        </div>
        <div className="space-y-3">
          {Array.from({ length: 5 }).map(() => (
            <div key={crypto.randomUUID()} className="flex items-center gap-4">
              <Skeleton className="h-12 w-16 rounded-md" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-64" />
              <Skeleton className="h-4 w-20 ml-auto" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
