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

import { GetCouponsByProductIdService } from "@/domain/master/application/service/coupon/get-coupons-by-product-id.service";
import {
  httpCouponSchema,
  PrismaCouponMapper,
} from "@/infra/database/prisma/mappers/prisma-coupon.mapper";

const getCouponsByProductIdResponseSchema = z.object({
  coupons: z.array(httpCouponSchema),
});

export class GetCouponsByProductIdResponseDto extends createZodDto(
  getCouponsByProductIdResponseSchema,
) {}

@ApiTags("coupons")
@Controller("/coupons")
export class GetCouponsByProductIdController {
  constructor(
    private getCouponsByProductIdService: GetCouponsByProductIdService,
  ) {}

  @Get("product/:productId")
  @ApiOperation({ summary: "Get coupons by product ID" })
  @ApiExtraModels(GetCouponsByProductIdResponseDto)
  @ApiResponse({
    status: 200,
    description: "Coupons retrieved successfully",
    schema: {
      $ref: getSchemaPath(GetCouponsByProductIdResponseDto),
    },
  })
  async handle(
    @Param("productId") productId: string,
  ): Promise<GetCouponsByProductIdResponseDto> {
    const result = await this.getCouponsByProductIdService.execute({
      productId,
    });

    return {
      coupons: await Promise.all(
        result.coupons.map((coupon) => PrismaCouponMapper.toHttp(coupon)),
      ),
    };
  }
}
