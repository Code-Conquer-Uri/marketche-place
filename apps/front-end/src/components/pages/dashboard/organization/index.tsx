import { Suspense } from "react";
import { getOrganizationBySlugAction } from "@/actions/organization";
import { OrganizationHeader } from "./organization-header";
import { OrganizationHeaderSkeleton } from "./organization-header.skeleton";
import { OrganizationProductsList } from "./organization-products-list";
import { OrganizationProductsListSkeleton } from "./organization-products-list.skeleton";
import { OrganizationProductsSearchInput } from "./organization-products-search-input";

export async function OrganizationDashboard({
  searchParams,
  params,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    searchTerm?: string;
    page?: string;
    perPage?: string;
    orderBy?: string;
    orderDirection?: string;
  }>;
}) {
  const { searchTerm, page, perPage, orderBy, orderDirection } =
    await searchParams;

  const { slug } = await params;

  const [, organization] = await getOrganizationBySlugAction(slug);

  const organizationId = organization?.organization.id;

  if (!organizationId) {
    return null;
  }

  const headerKey = `header-${organizationId}`;
  const productsKey = `${organizationId}-${searchTerm}-${page}-${perPage}-${orderBy}-${orderDirection}`;

  return (
    <div className="space-y-6">
      <Suspense fallback={<OrganizationHeaderSkeleton />} key={headerKey}>
        <OrganizationHeader organizationId={organizationId} />
      </Suspense>

      <div className="space-y-4">
        <OrganizationProductsSearchInput />

        <Suspense
          fallback={<OrganizationProductsListSkeleton />}
          key={productsKey}
        >
          <OrganizationProductsList
            organizationId={organizationId}
            searchTerm={searchTerm}
            page={page}
            perPage={perPage}
            orderBy={orderBy}
            orderDirection={orderDirection}
          />
        </Suspense>
      </div>
    </div>
  );
}
