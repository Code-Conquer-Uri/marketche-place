import { Suspense } from "react";
import { OrganizationDashboard } from "@/components/pages/dashboard/organization";

export default async function DashboardPage({
  searchParams,
  params,
}: PageProps<"/dashboard/organization/[slug]">) {
  return (
    <div className="container mx-auto py-6">
      <Suspense>
        <OrganizationDashboard searchParams={searchParams} params={params} />
      </Suspense>
    </div>
  );
}
