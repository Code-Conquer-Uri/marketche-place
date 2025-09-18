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
  ApiParam,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from "@nestjs/swagger";
import { createZodDto } from "nestjs-zod";
import { z } from "zod";

import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { GetCouponService } from "@/domain/master/application/service/coupon/get-coupon.service";
import {
  httpCouponSchema,
  PrismaCouponMapper,
} from "@/infra/database/prisma/mappers/prisma-coupon.mapper";

import { ApiZodGenericErrorsResponse } from "../errors/swagger-zod-errors.decorator";

const getCouponResponseSchema = z.object({
  coupon: httpCouponSchema,
});

export class GetCouponResponseDto extends createZodDto(
  getCouponResponseSchema,
) {}

@ApiTags("coupons")
@Controller("/coupons")
@ApiBearerAuth()
export class GetCouponController {
  constructor(private getCouponService: GetCouponService) {}

  @Get(":id")
  @ApiOperation({ summary: "Get a coupon by ID" })
  @ApiExtraModels(GetCouponResponseDto)
  @ApiResponse({
    status: 200,
    description: "Coupon retrieved successfully",
    schema: {
      $ref: getSchemaPath(GetCouponResponseDto),
    },
  })
  @ApiParam({
    name: "id",
    description: "Coupon ID",
    type: String,
  })
  @ApiZodGenericErrorsResponse()
  async handle(@Param("id") couponId: string): Promise<GetCouponResponseDto> {
    const result = await this.getCouponService.execute({
      couponId,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException("Coupon not found");
        default:
          throw new BadRequestException(error.message);
      }
    }

    const { coupon } = result.value;

    return {
      coupon: await PrismaCouponMapper.toHttp(coupon),
    };
  }
}
