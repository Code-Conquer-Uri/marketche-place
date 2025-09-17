import type { Prisma, Promotion as PrismaPromotion } from "@prisma/client";
import { createZodDto } from "nestjs-zod";
import { z } from "zod";

import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import {
  Promotion,
  type PromotionProps,
} from "@/domain/master/enterprise/entities/promotion";

import type { ZodCustomShape } from "../../zod-custom-shape";

export const httpPromotionSchema = z.object<ZodCustomShape<PromotionProps>>({
  id: z.string(),

  discountPercentage: z.number(),
  productId: z.string(),
  userId: z.string(),

  validUntil: z.coerce.string().optional().nullable(),

  createdAt: z.coerce.string().optional().nullable(),
  updatedAt: z.coerce.string().optional().nullable(),
});

export class HttpPromotion extends createZodDto(httpPromotionSchema) {}

export class PrismaPromotionMapper {
  static toDomain(raw: PrismaPromotion): Promotion {
    return Promotion.create(
      {
        productId: new UniqueEntityID(raw.productId),
        userId: new UniqueEntityID(raw.userId),

        discountPercentage: raw.discountPercentage,
        validUntil: raw.validUntil,

        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(promotion: Promotion): Prisma.PromotionUncheckedCreateInput {
    return {
      id: promotion.id.toString(),

      discountPercentage: promotion.discountPercentage,
      productId: promotion.productId.toString(),
      userId: promotion.userId.toString(),

      validUntil: promotion.validUntil,

      createdAt: promotion.createdAt ?? undefined,
      updatedAt: promotion.updatedAt ?? undefined,
    };
  }

  static toHttp(promotion: Promotion): HttpPromotion {
    const httpPromotion = httpPromotionSchema.parse({
      id: promotion.id.toString(),

      discountPercentage: promotion.discountPercentage,

      validUntil: promotion.validUntil,

      productId: promotion.productId.toString(),
      userId: promotion.userId.toString(),

      createdAt: promotion.createdAt,
      updatedAt: promotion.updatedAt,
    } satisfies Omit<PromotionProps, "productId" | "userId"> & {
      id: string;
      productId: string;
      userId: string;
    });
    return httpPromotion;
  }
}
