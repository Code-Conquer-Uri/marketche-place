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

import { GetCouponsByProductsIdsService } from "@/domain/master/application/service/coupon/get-coupons-by-products-ids.service";
import {
  httpCouponSchema,
  PrismaCouponMapper,
} from "@/infra/database/prisma/mappers/prisma-coupon.mapper";

const getCouponsByProductsIdsResponseSchema = z.object({
  coupons: z.array(httpCouponSchema),
});

export class GetCouponsByProductsIdsResponseDto extends createZodDto(
  getCouponsByProductsIdsResponseSchema,
) {}

@ApiTags("coupons")
@Controller("/coupons")
export class GetCouponsByProductsIdsController {
  constructor(
    private getCouponsByProductsIdsService: GetCouponsByProductsIdsService,
  ) {}

  @Get("products")
  @ApiOperation({ summary: "Get coupons by multiple product IDs" })
  @ApiExtraModels(GetCouponsByProductsIdsResponseDto)
  @ApiResponse({
    status: 200,
    description: "Coupons retrieved successfully",
    schema: {
      $ref: getSchemaPath(GetCouponsByProductsIdsResponseDto),
    },
  })
  @ApiQuery({ name: "productIds", type: [String] })
  async handle(
    @Query("productIds") productIds: string[],
  ): Promise<GetCouponsByProductsIdsResponseDto> {
    const result = await this.getCouponsByProductsIdsService.execute({
      productIds,
    });

    return {
      coupons: await Promise.all(
        result.coupons.map((coupon) => PrismaCouponMapper.toHttp(coupon)),
      ),
    };
  }
}
