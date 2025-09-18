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

import { GetPromotionsByProductsIdsService } from "@/domain/master/application/service/promotion/get-promotions-by-products-ids.service";
import {
  httpPromotionSchema,
  PrismaPromotionMapper,
} from "@/infra/database/prisma/mappers/prisma-promotion.mapper";

const getPromotionsByProductsIdsResponseSchema = z.object({
  promotions: z.array(httpPromotionSchema),
});

export class GetPromotionsByProductsIdsResponseDto extends createZodDto(
  getPromotionsByProductsIdsResponseSchema,
) {}

@ApiTags("promotions")
@Controller("/promotions")
export class GetPromotionsByProductsIdsController {
  constructor(
    private getPromotionsByProductsIdsService: GetPromotionsByProductsIdsService,
  ) {}

  @Get("products")
  @ApiOperation({ summary: "Get promotions by product IDs" })
  @ApiQuery({
    name: "productIds",
    type: [String],
    description: "Array of product IDs",
  })
  @ApiExtraModels(GetPromotionsByProductsIdsResponseDto)
  @ApiResponse({
    status: 200,
    description: "Promotions retrieved successfully",
    schema: {
      $ref: getSchemaPath(GetPromotionsByProductsIdsResponseDto),
    },
  })
  async handle(
    @Query("productIds") productIds: string[],
  ): Promise<GetPromotionsByProductsIdsResponseDto> {
    const result = await this.getPromotionsByProductsIdsService.execute({
      productIds,
    });

    return {
      promotions: await Promise.all(
        result.promotions.map((promotion) =>
          PrismaPromotionMapper.toHttp(promotion),
        ),
      ),
    };
  }
}
