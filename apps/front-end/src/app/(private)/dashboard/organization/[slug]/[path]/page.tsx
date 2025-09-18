import { OrganizationView } from "@daveyplate/better-auth-ui";
import { organizationViewPaths } from "@daveyplate/better-auth-ui/server";

export function generateStaticParams() {
  return Object.values(organizationViewPaths).map((path) => ({ path }));
}

export default async function OrganizationPage({
  params,
}: PageProps<"/dashboard/organization/[slug]/[path]">) {
  const { path, slug } = await params;
  console.log(path);
  return (
    <main className="container p-4 md:p-6">
      <OrganizationView path={path} slug={slug} />
    </main>
  );
}
