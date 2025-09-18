import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Patch,
  UnauthorizedException,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiBody,
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from "@nestjs/swagger";
import { Session, type UserSession } from "@thallesp/nestjs-better-auth";
import { createZodDto } from "nestjs-zod";
import { z } from "zod";

import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { UpdatePromotionService } from "@/domain/master/application/service/promotion/update-promotion.service";
import {
  httpPromotionSchema,
  PrismaPromotionMapper,
} from "@/infra/database/prisma/mappers/prisma-promotion.mapper";

import { ApiZodGenericErrorsResponse } from "../errors/swagger-zod-errors.decorator";

const updatePromotionBodySchema = z.object({
  discountPercentage: z.number().min(0).max(100).optional(),
  validUntil: z.string().datetime().optional(),
});

export class UpdatePromotionBodyDto extends createZodDto(
  updatePromotionBodySchema,
) {}

const updatePromotionResponseSchema = z.object({
  promotion: httpPromotionSchema,
  message: z.string().optional(),
});

export class UpdatePromotionResponseDto extends createZodDto(
  updatePromotionResponseSchema,
) {}

@ApiTags("promotions")
@Controller("/promotions")
@ApiBearerAuth()
export class UpdatePromotionController {
  constructor(private updatePromotionService: UpdatePromotionService) {}

  @Patch(":id")
  @ApiOperation({ summary: "Update a promotion" })
  @ApiExtraModels(UpdatePromotionResponseDto)
  @ApiResponse({
    status: 200,
    description: "Promotion updated successfully",
    schema: {
      $ref: getSchemaPath(UpdatePromotionResponseDto),
    },
  })
  @ApiBody({
    type: UpdatePromotionBodyDto,
  })
  @ApiZodGenericErrorsResponse()
  async handle(
    @Session() session: UserSession,
    @Param("id") id: string,
    @Body() body: UpdatePromotionBodyDto,
  ): Promise<UpdatePromotionResponseDto> {
    const { discountPercentage, validUntil } = body;

    const currentUser = session.user.id;

    const result = await this.updatePromotionService.execute({
      userId: currentUser,
      promotionId: id,
      discountPercentage,
      validUntil: validUntil ? new Date(validUntil) : undefined,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case NotAllowedError:
          throw new UnauthorizedException(error.message);
        case ResourceNotFoundError:
          throw new BadRequestException("Promotion not found");
        default:
          throw new BadRequestException(error.message);
      }
    }

    const { promotion } = result.value;

    return {
      promotion: await PrismaPromotionMapper.toHttp(promotion),
      message: "Promotion updated successfully",
    };
  }
}
