import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Param,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from "@nestjs/swagger";
import { createZodDto } from "nestjs-zod";
import { z } from "zod";

import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { GetPromotionService } from "@/domain/master/application/service/promotion/get-promotion.service";
import {
  httpPromotionSchema,
  PrismaPromotionMapper,
} from "@/infra/database/prisma/mappers/prisma-promotion.mapper";

import { ApiZodGenericErrorsResponse } from "../errors/swagger-zod-errors.decorator";

const getPromotionResponseSchema = z.object({
  promotion: httpPromotionSchema,
});

export class GetPromotionResponseDto extends createZodDto(
  getPromotionResponseSchema,
) {}

@ApiTags("promotions")
@Controller("/promotions")
@ApiBearerAuth()
export class GetPromotionController {
  constructor(private getPromotionService: GetPromotionService) {}

  @Get(":id")
  @ApiOperation({ summary: "Get a promotion by ID" })
  @ApiExtraModels(GetPromotionResponseDto)
  @ApiResponse({
    status: 200,
    description: "Promotion retrieved successfully",
    schema: {
      $ref: getSchemaPath(GetPromotionResponseDto),
    },
  })
  @ApiZodGenericErrorsResponse()
  async handle(@Param("id") id: string): Promise<GetPromotionResponseDto> {
    const result = await this.getPromotionService.execute({
      promotionId: id,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException("Promotion not found");
        default:
          throw new BadRequestException(error.message);
      }
    }

    const { promotion } = result.value;

    return {
      promotion: await PrismaPromotionMapper.toHttp(promotion),
    };
  }
}
