import {
  BadRequestException,
  Body,
  Controller,
  Post,
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
import { CreatePromotionService } from "@/domain/master/application/service/promotion/create-promotion.service";
import {
  httpPromotionSchema,
  PrismaPromotionMapper,
} from "@/infra/database/prisma/mappers/prisma-promotion.mapper";

import { ApiZodGenericErrorsResponse } from "../errors/swagger-zod-errors.decorator";

const createPromotionBodySchema = z.object({
  productId: z.string(),
  discountPercentage: z.number().min(0).max(100),
  validUntil: z.string().datetime(),
});

export class CreatePromotionBodyDto extends createZodDto(
  createPromotionBodySchema,
) {}

const createPromotionResponseSchema = z.object({
  promotion: httpPromotionSchema,
  message: z.string().optional(),
});

export class CreatePromotionResponseDto extends createZodDto(
  createPromotionResponseSchema,
) {}

@ApiTags("promotions")
@Controller("/promotions")
@ApiBearerAuth()
export class CreatePromotionController {
  constructor(private createPromotionService: CreatePromotionService) {}

  @Post()
  @ApiOperation({ summary: "Create a promotion" })
  @ApiExtraModels(CreatePromotionResponseDto)
  @ApiResponse({
    status: 201,
    description: "Promotion created successfully",
    schema: {
      $ref: getSchemaPath(CreatePromotionResponseDto),
    },
  })
  @ApiBody({
    type: CreatePromotionBodyDto,
  })
  @ApiZodGenericErrorsResponse()
  async handle(
    @Session() session: UserSession,
    @Body() body: CreatePromotionBodyDto,
  ): Promise<CreatePromotionResponseDto> {
    const { productId, discountPercentage, validUntil } = body;

    const currentUser = session.user.id;

    const result = await this.createPromotionService.execute({
      userId: currentUser,
      productId,
      discountPercentage,
      validUntil: new Date(validUntil),
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case NotAllowedError:
          throw new UnauthorizedException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }

    const { promotion } = result.value;

    return {
      promotion: await PrismaPromotionMapper.toHttp(promotion),
      message: "Promotion created successfully",
    };
  }
}
