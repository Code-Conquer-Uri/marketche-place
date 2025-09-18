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

import { SearchCouponsService } from "@/domain/master/application/service/coupon/search-coupons.service";
import {
  httpCouponSchema,
  PrismaCouponMapper,
} from "@/infra/database/prisma/mappers/prisma-coupon.mapper";

import { ApiZodGenericErrorsResponse } from "../errors/swagger-zod-errors.decorator";

const searchCouponsResponseSchema = z.object({
  coupons: z.array(httpCouponSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number(),
});

export class SearchCouponsResponseDto extends createZodDto(
  searchCouponsResponseSchema,
) {}

@ApiTags("coupons")
@Controller("/coupons")
export class SearchCouponsController {
  constructor(private searchCouponsService: SearchCouponsService) {}

  @Get()
  @ApiOperation({ summary: "Search coupons with advanced filters" })
  @ApiExtraModels(SearchCouponsResponseDto)
  @ApiResponse({
    status: 200,
    description: "Coupons retrieved successfully",
    schema: {
      $ref: getSchemaPath(SearchCouponsResponseDto),
    },
  })
  @ApiQuery({
    name: "productId",
    required: false,
    description: "Filter by product ID",
    type: String,
  })
  @ApiQuery({
    name: "userId",
    required: false,
    description: "Filter by user ID",
    type: String,
  })
  @ApiQuery({
    name: "minDiscountPercentage",
    required: false,
    description: "Minimum discount percentage",
    type: Number,
  })
  @ApiQuery({
    name: "maxDiscountPercentage",
    required: false,
    description: "Maximum discount percentage",
    type: Number,
  })
  @ApiQuery({
    name: "minQuantity",
    required: false,
    description: "Minimum quantity",
    type: Number,
  })
  @ApiQuery({
    name: "maxQuantity",
    required: false,
    description: "Maximum quantity",
    type: Number,
  })
  @ApiQuery({
    name: "page",
    required: false,
    description: "Page number (default: 1)",
    type: Number,
  })
  @ApiQuery({
    name: "limit",
    required: false,
    description: "Items per page (default: 10)",
    type: Number,
  })
  @ApiZodGenericErrorsResponse()
  async handle(
    @Query("productId") productId?: string,
    @Query("userId") userId?: string,
    @Query("minDiscountPercentage") minDiscountPercentage?: string,
    @Query("maxDiscountPercentage") maxDiscountPercentage?: string,
    @Query("minQuantity") minQuantity?: string,
    @Query("maxQuantity") maxQuantity?: string,
    @Query("page") page?: string,
    @Query("limit") limit?: string,
  ): Promise<SearchCouponsResponseDto> {
    const result = await this.searchCouponsService.execute({
      productId,
      userId,
      minDiscountPercentage: minDiscountPercentage
        ? parseFloat(minDiscountPercentage)
        : undefined,
      maxDiscountPercentage: maxDiscountPercentage
        ? parseFloat(maxDiscountPercentage)
        : undefined,
      minQuantity: minQuantity ? parseInt(minQuantity, 10) : undefined,
      maxQuantity: maxQuantity ? parseInt(maxQuantity, 10) : undefined,
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
    });

    const {
      coupons,
      total,
      page: resultPage,
      limit: resultLimit,
      totalPages,
    } = result.value;

    return {
      coupons: await Promise.all(
        coupons.map((coupon) => PrismaCouponMapper.toHttp(coupon)),
      ),
      total,
      page: resultPage,
      limit: resultLimit,
      totalPages,
    };
  }
}
