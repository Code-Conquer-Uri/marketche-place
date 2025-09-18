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

import { GetPromotionsByProductIdService } from "@/domain/master/application/service/promotion/get-promotions-by-product-id.service";
import {
  httpPromotionSchema,
  PrismaPromotionMapper,
} from "@/infra/database/prisma/mappers/prisma-promotion.mapper";

const getPromotionsByProductIdResponseSchema = z.object({
  promotions: z.array(httpPromotionSchema),
});

export class GetPromotionsByProductIdResponseDto extends createZodDto(
  getPromotionsByProductIdResponseSchema,
) {}

@ApiTags("promotions")
@Controller("/promotions")
export class GetPromotionsByProductIdController {
  constructor(
    private getPromotionsByProductIdService: GetPromotionsByProductIdService,
  ) {}

  @Get("product/:productId")
  @ApiOperation({ summary: "Get promotions by product ID" })
  @ApiExtraModels(GetPromotionsByProductIdResponseDto)
  @ApiResponse({
    status: 200,
    description: "Promotions retrieved successfully",
    schema: {
      $ref: getSchemaPath(GetPromotionsByProductIdResponseDto),
    },
  })
  async handle(
    @Param("productId") productId: string,
  ): Promise<GetPromotionsByProductIdResponseDto> {
    const result = await this.getPromotionsByProductIdService.execute({
      productId,
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
