import type { Prisma, StoreFront as PrismaStoreFront } from "@prisma/client";
import { createZodDto } from "nestjs-zod";
import { z } from "zod";

import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import {
  StoreFront,
  type StoreFrontProps,
} from "@/domain/master/enterprise/entities/store-front";
import type { ZodCustomShape } from "../../zod-custom-shape";

export const httpStoreFrontSchema = z.object<ZodCustomShape<StoreFrontProps>>({
  id: z.string(),

  organizationId: z.string(),

  logoImageUrl: z.string(),
  logoImageBlurData: z.string(),
  bannerImageUrl: z.string(),
  bannerImageBlurData: z.string(),
  whatsappNumber: z.string().optional(),
  location: z.string(),
  theme: z.enum(["DEFAULT", "AMETHYST_HAZE", "SOLAR_DUSK"]),
});

export class HttpStoreFront extends createZodDto(httpStoreFrontSchema) {}

export class PrismaStoreFrontMapper {
  static toDomain(raw: PrismaStoreFront): StoreFront {
    return StoreFront.create(
      {
        organizationId: raw.organizationId,
        logoImageUrl: raw.logoImageUrl ?? "",
        logoImageBlurData: raw.logoImageBlurData ?? "",
        bannerImageUrl: raw.bannerImageUrl ?? "",
        bannerImageBlurData: raw.bannerImageBlurData ?? "",
        whatsappNumber: raw.whatsappNumber ?? undefined,
        location: raw.location,
        theme: raw.theme,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(
    storeFront: StoreFront,
  ): Prisma.StoreFrontUncheckedCreateInput {
    return {
      id: storeFront.id.toString(),
      organizationId: storeFront.organizationId,
      logoImageUrl: storeFront.logoImageUrl,
      logoImageBlurData: storeFront.logoImageBlurData,
      bannerImageUrl: storeFront.bannerImageUrl,
      bannerImageBlurData: storeFront.bannerImageBlurData,
      whatsappNumber: storeFront.whatsappNumber,
      location: storeFront.location,
      theme: storeFront.theme,
    };
  }

  static async toHttp(storeFront: StoreFront): Promise<HttpStoreFront> {
    const httpStoreFront = httpStoreFrontSchema.parse({
      id: storeFront.id.toString(),
      organizationId: storeFront.organizationId,
      logoImageUrl: storeFront.logoImageUrl,
      logoImageBlurData: storeFront.logoImageBlurData,
      bannerImageUrl: storeFront.bannerImageUrl,
      bannerImageBlurData: storeFront.bannerImageBlurData,
      whatsappNumber: storeFront.whatsappNumber,
      location: storeFront.location,
      theme: storeFront.theme,
    });
    return httpStoreFront;
  }
}
