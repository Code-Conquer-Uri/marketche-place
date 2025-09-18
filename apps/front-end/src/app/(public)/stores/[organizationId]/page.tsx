import { Suspense } from "react";
import { StoreFrontView } from "@/components/pages/store-front/store-front-view";
import { StoreFrontViewSkeleton } from "@/components/pages/store-front/store-front-view.skeleton";

export default async function StoreFrontPage({
  params,
  searchParams,
}: {
  params: Promise<{ organizationId: string }>;
  searchParams: Promise<{ page?: string; perPage?: string }>;
}) {
  const { organizationId } = await params;
  const { page, perPage } = await searchParams;
  const key = `${organizationId}-${page}-${perPage}`;
  return (
    <div className="w-full pt-24 pb-10">
      <div className="mx-auto max-w-7xl px-5 xl:px-0">
        <Suspense fallback={<StoreFrontViewSkeleton />} key={key}>
          <StoreFrontView
            organizationId={organizationId}
            page={page}
            perPage={perPage}
          />
        </Suspense>
      </div>
    </div>
  );
}
