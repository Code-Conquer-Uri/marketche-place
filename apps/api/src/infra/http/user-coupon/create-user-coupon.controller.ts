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
import { CreateUserCouponService } from "@/domain/master/application/service/user-coupon/create-user-coupon.service";
import {
  httpUserCouponSchema,
  PrismaUserCouponMapper,
} from "@/infra/database/prisma/mappers/prisma-user-coupon.mapper";

import { ApiZodGenericErrorsResponse } from "../errors/swagger-zod-errors.decorator";

const createUserCouponBodySchema = z.object({
  couponId: z.string(),
});

export class CreateUserCouponBodyDto extends createZodDto(
  createUserCouponBodySchema,
) {}

const createUserCouponResponseSchema = z.object({
  userCoupon: httpUserCouponSchema,
  message: z.string().optional(),
});

export class CreateUserCouponResponseDto extends createZodDto(
  createUserCouponResponseSchema,
) {}

@ApiTags("user-coupons")
@Controller("/user-coupons")
@ApiBearerAuth()
export class CreateUserCouponController {
  constructor(private createUserCouponService: CreateUserCouponService) {}

  @Post()
  @ApiOperation({ summary: "Create a user coupon" })
  @ApiExtraModels(CreateUserCouponResponseDto)
  @ApiResponse({
    status: 201,
    description: "User coupon created successfully",
    schema: {
      $ref: getSchemaPath(CreateUserCouponResponseDto),
    },
  })
  @ApiBody({
    type: CreateUserCouponBodyDto,
  })
  @ApiZodGenericErrorsResponse()
  async handle(
    @Session() session: UserSession,
    @Body() body: CreateUserCouponBodyDto,
  ): Promise<CreateUserCouponResponseDto> {
    const { couponId } = body;

    const currentUser = session.user.id;

    const result = await this.createUserCouponService.execute({
      userId: currentUser,
      couponId,
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

    const { userCoupon } = result.value;

    return {
      userCoupon: PrismaUserCouponMapper.toHttp(userCoupon),
      message: "User coupon created successfully",
    };
  }
}
