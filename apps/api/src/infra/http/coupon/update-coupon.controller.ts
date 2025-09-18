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
  ApiParam,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from "@nestjs/swagger";
import { Session, type UserSession } from "@thallesp/nestjs-better-auth";
import { createZodDto } from "nestjs-zod";
import { z } from "zod";

import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { UpdateCouponService } from "@/domain/master/application/service/coupon/update-coupon.service";
import {
  httpCouponSchema,
  PrismaCouponMapper,
} from "@/infra/database/prisma/mappers/prisma-coupon.mapper";

import { ApiZodGenericErrorsResponse } from "../errors/swagger-zod-errors.decorator";

const updateCouponBodySchema = z.object({
  discountPercentage: z.number().min(0).max(100).optional(),
  maxQuantity: z.number().int().positive().optional(),
  currentQuantity: z.number().int().min(0).optional(),
});

export class UpdateCouponBodyDto extends createZodDto(updateCouponBodySchema) {}

const updateCouponResponseSchema = z.object({
  coupon: httpCouponSchema,
  message: z.string().optional(),
});

export class UpdateCouponResponseDto extends createZodDto(
  updateCouponResponseSchema,
) {}

@ApiTags("coupons")
@Controller("/coupons")
@ApiBearerAuth()
export class UpdateCouponController {
  constructor(private updateCouponService: UpdateCouponService) {}

  @Patch(":id")
  @ApiOperation({ summary: "Update a coupon" })
  @ApiExtraModels(UpdateCouponResponseDto)
  @ApiResponse({
    status: 200,
    description: "Coupon updated successfully",
    schema: {
      $ref: getSchemaPath(UpdateCouponResponseDto),
    },
  })
  @ApiParam({
    name: "id",
    description: "Coupon ID",
    type: String,
  })
  @ApiBody({
    type: UpdateCouponBodyDto,
  })
  @ApiZodGenericErrorsResponse()
  async handle(
    @Session() session: UserSession,
    @Param("id") couponId: string,
    @Body() body: UpdateCouponBodyDto,
  ): Promise<UpdateCouponResponseDto> {
    const { discountPercentage, maxQuantity, currentQuantity } = body;

    const currentUser = session.user.id;

    const result = await this.updateCouponService.execute({
      userId: currentUser,
      couponId,
      discountPercentage,
      maxQuantity,
      currentQuantity,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case NotAllowedError:
          throw new UnauthorizedException(error.message);
        case ResourceNotFoundError:
          throw new BadRequestException("Coupon not found");
        default:
          throw new BadRequestException(error.message);
      }
    }

    const { coupon } = result.value;

    return {
      coupon: await PrismaCouponMapper.toHttp(coupon),
      message: "Coupon updated successfully",
    };
  }
}
