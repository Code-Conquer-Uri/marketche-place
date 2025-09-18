import { Suspense } from "react";
import { ProductsGrid } from "@/components/pages/products/products-grid";
import { ProductsGridSkeleton } from "@/components/pages/products/products-grid.skeleton";

type Props = {
  searchParams: Promise<{
    searchTerm?: string;
    page?: string;
    perPage?: string;
    orderBy?: string;
    orderDirection?: string;
    organizationId?: string;
  }>;
};

export default async function ProductsPage({ searchParams }: Props) {
  const { searchTerm, page, perPage, orderBy, orderDirection, organizationId } =
    await searchParams;

  const key = `${searchTerm}-${page}-${perPage}-${orderBy}-${orderDirection}-${organizationId}`;

  return (
    <div className="w-full pt-24 pb-10">
      <div className="mx-auto max-w-7xl px-5 xl:px-0 space-y-6">
        <h2 className="text-2xl font-semibold">Produtos</h2>
        <Suspense fallback={<ProductsGridSkeleton />} key={key}>
          <ProductsGrid
            searchTerm={searchTerm}
            page={page}
            perPage={perPage}
            orderBy={orderBy}
            orderDirection={orderDirection}
            organizationId={organizationId}
          />
        </Suspense>
      </div>
    </div>
  );
}
