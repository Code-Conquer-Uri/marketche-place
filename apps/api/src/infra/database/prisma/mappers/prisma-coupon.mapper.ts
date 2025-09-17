import type { Prisma, Coupon as PrismaCoupon } from "@prisma/client";
import { createZodDto } from "nestjs-zod";
import { z } from "zod";

import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import {
  Coupon,
  type CouponProps,
} from "@/domain/master/enterprise/entities/coupon";

import type { ZodCustomShape } from "../../zod-custom-shape";

export const httpCouponSchema = z.object<ZodCustomShape<CouponProps>>({
  id: z.string(),

  currentQuantity: z.number(),
  discountPercentage: z.number(),
  maxQuantity: z.number(),
  productId: z.string(),
  userId: z.string(),

  createdAt: z.coerce.string().optional().nullable(),
  updatedAt: z.coerce.string().optional().nullable(),
});

export class HttpCoupon extends createZodDto(httpCouponSchema) {}

export class PrismaCouponMapper {
  static toDomain(raw: PrismaCoupon): Coupon {
    return Coupon.create(
      {
        currentQuantity: raw.currentQuantity,
        discountPercentage: raw.discountPercentage,
        maxQuantity: raw.maxQuantity,
        productId: new UniqueEntityID(raw.productId),
        userId: new UniqueEntityID(raw.userId),

        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(coupon: Coupon): Prisma.CouponUncheckedCreateInput {
    return {
      id: coupon.id.toString(),

      currentQuantity: coupon.currentQuantity,
      discountPercentage: coupon.discountPercentage,
      maxQuantity: coupon.maxQuantity,
      productId: coupon.productId.toString(),
      userId: coupon.userId.toString(),

      createdAt: coupon.createdAt ?? undefined,
      updatedAt: coupon.updatedAt ?? undefined,
    };
  }

  static toHttp(coupon: Coupon): HttpCoupon {
    const httpCoupon = httpCouponSchema.parse({
      id: coupon.id.toString(),

      currentQuantity: coupon.currentQuantity,
      discountPercentage: coupon.discountPercentage,
      maxQuantity: coupon.maxQuantity,

      productId: coupon.productId.toString(),
      userId: coupon.userId.toString(),

      createdAt: coupon.createdAt,
      updatedAt: coupon.updatedAt,
    } satisfies Omit<CouponProps, "productId" | "userId"> & {
      id: string;
      productId: string;
      userId: string;
    });
    return httpCoupon;
  }
}
