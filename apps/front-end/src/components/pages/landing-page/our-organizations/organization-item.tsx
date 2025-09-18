import { Route } from "next";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";
import { getStoreFrontAction } from "@/actions/store-front";
import { SearchOrganizationsResponseDto } from "@/http";

type Organization = SearchOrganizationsResponseDto["organizations"][number];

export const OrganizationItem: FC<{ organization: Organization }> = async ({
  organization,
}) => {
  const [error, data] = await getStoreFrontAction({
    organizationId: organization.id,
  });

  if (error) {
    return;
  }

  const storeFront = data.storeFront;

  return (
    <Link
      href={`/stores/${organization.id}` as Route}
      className="flex h-40 w-full items-center justify-center bg-[#F8FAFC] transition-all hover:bg-slate-200/80 hover:shadow-inner"
    >
      <div className="h-[5.125rem] w-[13.375rem]">
        <Image
          src={storeFront.logoImageUrl}
          alt={organization.name}
          blurDataURL={storeFront.bannerImageBlurData}
          width={214}
          height={82}
          className="h-full w-full object-cover"
        />
      </div>
    </Link>
  );
};
