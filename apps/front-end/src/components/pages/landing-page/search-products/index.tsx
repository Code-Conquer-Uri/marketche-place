import { Suspense } from "react";
import { SearchProductsList } from "./search-products.list";
import { SearchProductsListSkeleton } from "./search-products-list.skeleton";

export async function SearchProducts({
  searchParams,
}: {
  searchParams: Promise<{
    searchTerm?: string;
    page?: string;
    perPage?: string;
    orderBy?: string;
    orderDirection?: string;
    organizationId?: string;
  }>;
}) {
  const { searchTerm, page, perPage, orderBy, orderDirection, organizationId } =
    await searchParams;

  const key = `${searchTerm}-${page}-${perPage}-${orderBy}-${orderDirection}-${organizationId}`;

  return (
    <Suspense fallback={<SearchProductsListSkeleton />} key={key}>
      <SearchProductsList
        searchTerm={searchTerm}
        page={page}
        perPage={perPage}
        orderBy={orderBy}
        orderDirection={orderDirection}
        organizationId={organizationId}
      />
    </Suspense>
  );
}
