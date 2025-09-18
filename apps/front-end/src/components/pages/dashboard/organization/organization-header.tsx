import { CameraIcon } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import type { FC } from "react";
import { getStoreFrontAction } from "@/actions/store-front";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { AddOrganizationHeaderModal } from "./add-organization-header-modal";

export const OrganizationHeader: FC<{
  organizationId: string;
}> = async ({ organizationId }) => {
  const [error, data] = await getStoreFrontAction({ organizationId });

  if (error) {
    return (
      <AddOrganizationHeaderModal organizationId={organizationId}>
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
    <Card>
      <CardHeader className="p-0">
        <div className="relative h-48 w-full">
          <Image
            src={storeFront.bannerImageUrl}
            blurDataURL={storeFront.bannerImageBlurData}
            alt={`${storeFront.location} banner`}
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-4 flex items-center gap-4">
            <div className="relative h-16 w-16 rounded-full overflow-hidden border-2 border-white">
              <Image
                src={storeFront.logoImageUrl}
                blurDataURL={storeFront.logoImageBlurData}
                alt={`${storeFront.location} logo`}
                fill
                className="object-cover"
                sizes="64px"
              />
            </div>
            <div className="text-white">
              <h1 className="text-2xl font-bold">{storeFront.location}</h1>
              <p className="text-sm opacity-90">Organization Dashboard</p>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Welcome to your dashboard</h2>
            <p className="text-muted-foreground">
              Manage your products and store settings
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Theme</p>
            <p className="text-sm font-medium">{storeFront.theme}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
