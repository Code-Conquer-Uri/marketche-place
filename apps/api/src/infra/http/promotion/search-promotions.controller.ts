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

import { SearchPromotionsService } from "@/domain/master/application/service/promotion/search-promotions.service";
import {
  httpPromotionSchema,
  PrismaPromotionMapper,
} from "@/infra/database/prisma/mappers/prisma-promotion.mapper";

import { ApiZodGenericErrorsResponse } from "../errors/swagger-zod-errors.decorator";

const searchPromotionsResponseSchema = z.object({
  promotions: z.array(httpPromotionSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number(),
});

export class SearchPromotionsResponseDto extends createZodDto(
  searchPromotionsResponseSchema,
) {}

@ApiTags("promotions")
@Controller("/promotions")
export class SearchPromotionsController {
  constructor(private searchPromotionsService: SearchPromotionsService) {}

  @Get()
  @ApiOperation({ summary: "Search promotions with advanced filters" })
  @ApiExtraModels(SearchPromotionsResponseDto)
  @ApiResponse({
    status: 200,
    description: "Promotions retrieved successfully",
    schema: {
      $ref: getSchemaPath(SearchPromotionsResponseDto),
    },
  })
  @ApiQuery({
    name: "productId",
    required: false,
    description: "Filter by product ID",
  })
  @ApiQuery({
    name: "userId",
    required: false,
    description: "Filter by user ID",
  })
  @ApiQuery({
    name: "minDiscountPercentage",
    required: false,
    description: "Minimum discount percentage",
  })
  @ApiQuery({
    name: "maxDiscountPercentage",
    required: false,
    description: "Maximum discount percentage",
  })
  @ApiQuery({
    name: "validFrom",
    required: false,
    description: "Valid from date (ISO string)",
  })
  @ApiQuery({
    name: "validUntil",
    required: false,
    description: "Valid until date (ISO string)",
  })
  @ApiQuery({
    name: "isActive",
    required: false,
    description: "Filter by active status",
  })
  @ApiQuery({
    name: "page",
    required: false,
    description: "Page number (default: 1)",
  })
  @ApiQuery({
    name: "limit",
    required: false,
    description: "Items per page (default: 10)",
  })
  @ApiZodGenericErrorsResponse()
  async handle(
    @Query("productId") productId?: string,
    @Query("userId") userId?: string,
    @Query("minDiscountPercentage") minDiscountPercentage?: string,
    @Query("maxDiscountPercentage") maxDiscountPercentage?: string,
    @Query("validFrom") validFrom?: string,
    @Query("validUntil") validUntil?: string,
    @Query("isActive") isActive?: string,
    @Query("page") page?: string,
    @Query("limit") limit?: string,
  ): Promise<SearchPromotionsResponseDto> {
    const result = await this.searchPromotionsService.execute({
      productId,
      userId,
      minDiscountPercentage: minDiscountPercentage
        ? parseFloat(minDiscountPercentage)
        : undefined,
      maxDiscountPercentage: maxDiscountPercentage
        ? parseFloat(maxDiscountPercentage)
        : undefined,
      validFrom: validFrom ? new Date(validFrom) : undefined,
      validUntil: validUntil ? new Date(validUntil) : undefined,
      isActive: isActive ? isActive.toLowerCase() === "true" : undefined,
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
    });

    const {
      promotions,
      total,
      page: resultPage,
      limit: resultLimit,
      totalPages,
    } = result.value;

    return {
      promotions: await Promise.all(
        promotions.map((promotion) => PrismaPromotionMapper.toHttp(promotion)),
      ),
      total,
      page: resultPage,
      limit: resultLimit,
      totalPages,
    };
  }
}
