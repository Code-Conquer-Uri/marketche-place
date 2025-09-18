import { Controller, Get, Param } from "@nestjs/common";
import {
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from "@nestjs/swagger";
import { createZodDto } from "nestjs-zod";
import { z } from "zod";

import { GetUserCouponsByCouponIdService } from "@/domain/master/application/service/user-coupon/get-user-coupons-by-coupon-id.service";
import {
  httpUserCouponSchema,
  PrismaUserCouponMapper,
} from "@/infra/database/prisma/mappers/prisma-user-coupon.mapper";

const getUserCouponsByCouponIdResponseSchema = z.object({
  userCoupons: z.array(httpUserCouponSchema),
});

export class GetUserCouponsByCouponIdResponseDto extends createZodDto(
  getUserCouponsByCouponIdResponseSchema,
) {}

@ApiTags("user-coupons")
@Controller("/user-coupons")
export class GetUserCouponsByCouponIdController {
  constructor(
    private getUserCouponsByCouponIdService: GetUserCouponsByCouponIdService,
  ) {}

  @Get("coupon/:couponId")
  @ApiOperation({ summary: "Get user coupons by coupon ID" })
  @ApiExtraModels(GetUserCouponsByCouponIdResponseDto)
  @ApiResponse({
    status: 200,
    description: "User coupons retrieved successfully",
    schema: {
      $ref: getSchemaPath(GetUserCouponsByCouponIdResponseDto),
    },
  })
  async handle(
    @Param("couponId") couponId: string,
  ): Promise<GetUserCouponsByCouponIdResponseDto> {
    const result = await this.getUserCouponsByCouponIdService.execute({
      couponId,
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
