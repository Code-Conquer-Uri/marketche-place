import { CameraIcon } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import type { FC } from "react";
import { getStoreFrontAction } from "@/actions/store-front";
import { Card, CardContent } from "@/components/ui/card";
import { GetOrganizationBySlugResponseDto } from "@/http";
import { AddOrganizationHeaderModal } from "./add-organization-header-modal";

export const OrganizationHeader: FC<{
  organization: GetOrganizationBySlugResponseDto["organization"];
}> = async ({ organization }) => {
  const [error, data] = await getStoreFrontAction({
    organizationId: organization.id,
  });

  if (error) {
    return (
      <AddOrganizationHeaderModal organizationId={organization.id}>
        <div className="w-full border-2 border-dashed border-foreground h-[8.5rem] lg:h-64 rounded-md flex items-center justify-center cursor-pointer bg-muted/20 hover:bg-muted/80 transition">
          <div className="flex flex-col items-center m-auto gap-1 px-5 py-2 text-center">
            <CameraIcon size={48} />
            <p className="text-muted-foreground text-sm">
              Clique aqui para fazer o upload de uma foto para a capa
            </p>
          </div>
        </div>
      </AddOrganizationHeaderModal>
    );
  }

  if (!data?.storeFront) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <p className="text-muted-foreground">Organization not found</p>
        </CardContent>
      </Card>
    );
  }

  const { storeFront } = data;

  return (
    <div className="flex flex-col gap-10 pt-3 lg:pt-6">
      <div className="flex flex-col gap-2.5 lg:gap-5">
        <div className="relative w-full h-[8.5rem] lg:h-64 rounded-md overflow-hidden">
          <Image
            src={storeFront.bannerImageUrl}
            blurDataURL={storeFront.bannerImageBlurData}
            alt={`${storeFront.location} banner`}
            fill
            className="object-cover"
            sizes="100vw"
          />
        </div>

        <div className="flex flex-col gap-4 lg:flex-row">
          <div className="relative w-20 lg:w-[6.5rem] h-20 lg:h-[6.5rem] rounded-md overflow-hidden">
            <Image
              src={storeFront.logoImageUrl}
              blurDataURL={storeFront.logoImageBlurData}
              alt={`${storeFront.location} logo`}
              fill
              className="object-cover"
              sizes="104px"
            />
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <h1 className="text-foreground text-3xl font-semibold">
                {organization.name}
              </h1>
              <p className="text-muted-foreground">{storeFront.location}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
