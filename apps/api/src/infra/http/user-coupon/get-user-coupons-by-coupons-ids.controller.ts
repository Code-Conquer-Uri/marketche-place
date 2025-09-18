import { Controller, Get, Query } from "@nestjs/common";
import {
  ApiExtraModels,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from "@nestjs/swagger";
import { createZodDto } from "nestjs-zod";
import { z } from "zod";

import { GetUserCouponsByCouponsIdsService } from "@/domain/master/application/service/user-coupon/get-user-coupons-by-coupons-ids.service";
import {
  httpUserCouponSchema,
  PrismaUserCouponMapper,
} from "@/infra/database/prisma/mappers/prisma-user-coupon.mapper";

const getUserCouponsByCouponsIdsResponseSchema = z.object({
  userCoupons: z.array(httpUserCouponSchema),
});

export class GetUserCouponsByCouponsIdsResponseDto extends createZodDto(
  getUserCouponsByCouponsIdsResponseSchema,
) {}

@ApiTags("user-coupons")
@Controller("/user-coupons")
export class GetUserCouponsByCouponsIdsController {
  constructor(
    private getUserCouponsByCouponsIdsService: GetUserCouponsByCouponsIdsService,
  ) {}

  @Get("coupons")
  @ApiOperation({ summary: "Get user coupons by coupon IDs" })
  @ApiQuery({
    name: "couponIds",
    type: [String],
    description: "Array of coupon IDs",
  })
  @ApiExtraModels(GetUserCouponsByCouponsIdsResponseDto)
  @ApiResponse({
    status: 200,
    description: "User coupons retrieved successfully",
    schema: {
      $ref: getSchemaPath(GetUserCouponsByCouponsIdsResponseDto),
    },
  })
  async handle(
    @Query("couponIds") couponIds: string[],
  ): Promise<GetUserCouponsByCouponsIdsResponseDto> {
    const result = await this.getUserCouponsByCouponsIdsService.execute({
      couponIds,
    });

    return {
      userCoupons: await Promise.all(
        result.userCoupons.map((userCoupon) =>
          PrismaUserCouponMapper.toHttp(userCoupon),
        ),
      ),
    };
  }
}
