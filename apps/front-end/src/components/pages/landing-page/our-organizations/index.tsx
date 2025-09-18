import { FC, Suspense } from "react";
import { Container } from "@/components/container";
import { OrganizationList } from "./organization-list";
import { OrganizationListSkeleton } from "./organization-list-skeleton";

export const OurOrganizations: FC = () => {
  return (
    <Container>
      <article className="flex flex-col gap-5 text-center">
        <h2 className="text-3xl font-bold text-scharb-base-900">
          Lojas Parceiras em Erechim
        </h2>

        <Suspense fallback={<OrganizationListSkeleton />}>
          <OrganizationList />
        </Suspense>
      </article>
    </Container>
  );
};
