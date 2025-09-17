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

  logoImage: z.string(),
  bannerImage: z.string(),
  location: z.string(),
  theme: z.enum(["DEFAULT", "AMETHYST_HAZE", "SOLAR_DUSK"]),
});

export class HttpStoreFront extends createZodDto(httpStoreFrontSchema) {}

export class PrismaStoreFrontMapper {
  static toDomain(raw: PrismaStoreFront): StoreFront {
    return StoreFront.create(
      {
        organizationId: raw.organizationId,
        logoImage: Buffer.from(raw.logoImage),
        bannerImage: Buffer.from(raw.bannerImage),
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
      logoImage: storeFront.logoImage,
      bannerImage: storeFront.bannerImage,
      location: storeFront.location,
      theme: storeFront.theme,
    };
  }

  static toHttp(storeFront: StoreFront): HttpStoreFront {
    const base64LogoImage = storeFront.logoImage.toString("base64");
    const base64BannerImage = storeFront.bannerImage.toString("base64");

    const httpStoreFront = httpStoreFrontSchema.parse({
      id: storeFront.id.toString(),
      organizationId: storeFront.organizationId,
      logoImage: `data:image/jpeg;base64,${base64LogoImage}`,
      bannerImage: `data:image/jpeg;base64,${base64BannerImage}`,
      location: storeFront.location,
      theme: storeFront.theme,
    } satisfies Omit<StoreFrontProps, "logoImage" | "bannerImage"> & {
      id: string;
      logoImage: string;
      bannerImage: string;
    });
    return httpStoreFront;
  }
}
