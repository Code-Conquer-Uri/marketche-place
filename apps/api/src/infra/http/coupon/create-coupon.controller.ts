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
import { CreateCouponService } from "@/domain/master/application/service/coupon/create-coupon.service";
import {
  httpCouponSchema,
  PrismaCouponMapper,
} from "@/infra/database/prisma/mappers/prisma-coupon.mapper";

import { ApiZodGenericErrorsResponse } from "../errors/swagger-zod-errors.decorator";

const createCouponBodySchema = z.object({
  productId: z.string(),
  discountPercentage: z.number().min(0).max(100),
  maxQuantity: z.number().int().positive(),
});

export class CreateCouponBodyDto extends createZodDto(createCouponBodySchema) {}

const createCouponResponseSchema = z.object({
  coupon: httpCouponSchema,
  message: z.string().optional(),
});

export class CreateCouponResponseDto extends createZodDto(
  createCouponResponseSchema,
) {}

@ApiTags("coupons")
@Controller("/coupons")
@ApiBearerAuth()
export class CreateCouponController {
  constructor(private createCouponService: CreateCouponService) {}

  @Post()
  @ApiOperation({ summary: "Create a coupon" })
  @ApiExtraModels(CreateCouponResponseDto)
  @ApiResponse({
    status: 201,
    description: "Coupon created successfully",
    schema: {
      $ref: getSchemaPath(CreateCouponResponseDto),
    },
  })
  @ApiBody({
    type: CreateCouponBodyDto,
  })
  @ApiZodGenericErrorsResponse()
  async handle(
    @Session() session: UserSession,
    @Body() body: CreateCouponBodyDto,
  ): Promise<CreateCouponResponseDto> {
    const { productId, discountPercentage, maxQuantity } = body;

    const currentUser = session.user.id;

    const result = await this.createCouponService.execute({
      userId: currentUser,
      productId,
      discountPercentage,
      maxQuantity,
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

    const { coupon } = result.value;

    return {
      coupon: await PrismaCouponMapper.toHttp(coupon),
      message: "Coupon created successfully",
    };
  }
}
