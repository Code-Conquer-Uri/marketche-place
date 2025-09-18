import { OrganizationView } from "@daveyplate/better-auth-ui";
import { organizationViewPaths } from "@daveyplate/better-auth-ui/server";
import { Container } from "@/components/container";

export function generateStaticParams() {
  return Object.values(organizationViewPaths).map((path) => ({ path }));
}

export default async function OrganizationPage({
  params,
}: PageProps<"/dashboard/organization/[slug]/[path]">) {
  const { path, slug } = await params;
  return (
    <Container>
      <OrganizationView path={path} slug={slug} />
    </Container>
  );
}
