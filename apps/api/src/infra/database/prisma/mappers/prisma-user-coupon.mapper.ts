import type { Prisma, UserCoupons as PrismaUserCoupon } from "@prisma/client";
import { createZodDto } from "nestjs-zod";
import { z } from "zod";

import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import {
  UserCoupon,
  type UserCouponProps,
} from "@/domain/master/enterprise/entities/user-coupons";

import type { ZodCustomShape } from "../../zod-custom-shape";

export const httpUserCouponSchema = z.object<ZodCustomShape<UserCouponProps>>({
  id: z.string(),

  couponId: z.string(),
  userId: z.string(),
});

export class HttpUserCoupon extends createZodDto(httpUserCouponSchema) {}

export class PrismaUserCouponMapper {
  static toDomain(raw: PrismaUserCoupon): UserCoupon {
    return UserCoupon.create(
      {
        userId: new UniqueEntityID(raw.userId),
        couponId: new UniqueEntityID(raw.couponId),
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(
    userCoupon: UserCoupon,
  ): Prisma.UserCouponsUncheckedCreateInput {
    return {
      id: userCoupon.id.toString(),

      userId: userCoupon.userId.toString(),
      couponId: userCoupon.couponId.toString(),
    };
  }

  static toHttp(usercoupon: UserCoupon): HttpUserCoupon {
    const httpUserCoupon = httpUserCouponSchema.parse({
      id: usercoupon.id.toString(),

      couponId: usercoupon.couponId.toString(),
      userId: usercoupon.userId.toString(),
    } satisfies Omit<UserCouponProps, "couponId" | "userId"> & {
      id: string;
      couponId: string;
      userId: string;
    });
    return httpUserCoupon;
  }
}
