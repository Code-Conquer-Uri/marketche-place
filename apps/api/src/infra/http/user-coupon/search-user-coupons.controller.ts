import {
  BadRequestException,
  Controller,
  Get,
  Query,
  UnauthorizedException,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from "@nestjs/swagger";
import { Session, type UserSession } from "@thallesp/nestjs-better-auth";
import { createZodDto } from "nestjs-zod";
import { z } from "zod";

import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { SearchUserCouponsService } from "@/domain/master/application/service/user-coupon/search-user-coupons.service";
import {
  httpUserCouponSchema,
  PrismaUserCouponMapper,
} from "@/infra/database/prisma/mappers/prisma-user-coupon.mapper";

import { ApiZodGenericErrorsResponse } from "../errors/swagger-zod-errors.decorator";

const searchUserCouponsResponseSchema = z.object({
  userCoupons: z.array(httpUserCouponSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number(),
});

export class SearchUserCouponsResponseDto extends createZodDto(
  searchUserCouponsResponseSchema,
) {}

@ApiTags("user-coupons")
@Controller("/user-coupons")
@ApiBearerAuth()
export class SearchUserCouponsController {
  constructor(private searchUserCouponsService: SearchUserCouponsService) {}

  @Get()
  @ApiOperation({ summary: "Search user coupons with pagination" })
  @ApiExtraModels(SearchUserCouponsResponseDto)
  @ApiResponse({
    status: 200,
    description: "User coupons retrieved successfully",
    schema: {
      $ref: getSchemaPath(SearchUserCouponsResponseDto),
    },
  })
  @ApiQuery({
    name: "couponId",
    required: false,
    description: "Filter by coupon ID",
  })
  @ApiQuery({
    name: "page",
    required: false,
    description: "Page number (default: 1)",
  })
  @ApiQuery({
    name: "limit",
    required: false,
    description: "Items per page (default: 10)",
  })
  @ApiZodGenericErrorsResponse()
  async handle(
    @Session() session: UserSession,
    @Query("couponId") couponId?: string,
    @Query("page") page?: string,
    @Query("limit") limit?: string,
  ): Promise<SearchUserCouponsResponseDto> {
    const currentUser = session.user.id;

    const result = await this.searchUserCouponsService.execute({
      userId: currentUser,
      couponId,
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
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

    const {
      userCoupons,
      total,
      page: resultPage,
      limit: resultLimit,
      totalPages,
    } = result.value;

    return {
      userCoupons: userCoupons.map((userCoupon) =>
        PrismaUserCouponMapper.toHttp(userCoupon),
      ),
      total,
      page: resultPage,
      limit: resultLimit,
      totalPages,
    };
  }
}
