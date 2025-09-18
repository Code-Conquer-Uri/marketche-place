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
import { GetUserCouponService } from "@/domain/master/application/service/user-coupon/get-user-coupon.service";
import {
  httpUserCouponSchema,
  PrismaUserCouponMapper,
} from "@/infra/database/prisma/mappers/prisma-user-coupon.mapper";

import { ApiZodGenericErrorsResponse } from "../errors/swagger-zod-errors.decorator";

const getUserCouponResponseSchema = z.object({
  userCoupon: httpUserCouponSchema,
});

export class GetUserCouponResponseDto extends createZodDto(
  getUserCouponResponseSchema,
) {}

@ApiTags("user-coupons")
@Controller("/user-coupons")
@ApiBearerAuth()
export class GetUserCouponController {
  constructor(private getUserCouponService: GetUserCouponService) {}

  @Get(":id")
  @ApiOperation({ summary: "Get a user coupon by ID" })
  @ApiExtraModels(GetUserCouponResponseDto)
  @ApiResponse({
    status: 200,
    description: "User coupon retrieved successfully",
    schema: {
      $ref: getSchemaPath(GetUserCouponResponseDto),
    },
  })
  @ApiZodGenericErrorsResponse()
  async handle(@Param("id") id: string): Promise<GetUserCouponResponseDto> {
    const result = await this.getUserCouponService.execute({
      userCouponId: id,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException("User coupon not found");
        default:
          throw new BadRequestException(error.message);
      }
    }

    const { userCoupon } = result.value;

    return {
      userCoupon: PrismaUserCouponMapper.toHttp(userCoupon),
    };
  }
}
