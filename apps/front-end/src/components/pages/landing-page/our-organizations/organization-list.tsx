import { Suspense } from "react";
import { searchOrganizationsAction } from "@/actions/organization";
import { OrganizationItem } from "./organization-item";
import { OrganizationItemSkeleton } from "./organization-item-skeleton";

export const OrganizationList = async () => {
  const [error, data] = await searchOrganizationsAction({ perPage: 6 });

  if (error) {
    return;
  }

  return (
    <div className="grid gap-1 sm:grid-cols-2 lg:grid-cols-3">
      {data.organizations.map((organization) => (
        <Suspense key={organization.id} fallback={<OrganizationItemSkeleton />}>
          <OrganizationItem organization={organization} />
        </Suspense>
      ))}
    </div>
  );
};
