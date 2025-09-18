import {
  BadRequestException,
  Controller,
  Delete,
  Param,
  UnauthorizedException,
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
import { Session, type UserSession } from "@thallesp/nestjs-better-auth";
import { createZodDto } from "nestjs-zod";
import { z } from "zod";

import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { DeleteCouponService } from "@/domain/master/application/service/coupon/delete-coupon.service";

import { ApiZodGenericErrorsResponse } from "../errors/swagger-zod-errors.decorator";

const deleteCouponResponseSchema = z.object({
  message: z.string(),
});

export class DeleteCouponResponseDto extends createZodDto(
  deleteCouponResponseSchema,
) {}

@ApiTags("coupons")
@Controller("/coupons")
@ApiBearerAuth()
export class DeleteCouponController {
  constructor(private deleteCouponService: DeleteCouponService) {}

  @Delete(":id")
  @ApiOperation({ summary: "Delete a coupon" })
  @ApiExtraModels(DeleteCouponResponseDto)
  @ApiResponse({
    status: 200,
    description: "Coupon deleted successfully",
    schema: {
      $ref: getSchemaPath(DeleteCouponResponseDto),
    },
  })
  @ApiParam({
    name: "id",
    description: "Coupon ID",
    type: String,
  })
  @ApiZodGenericErrorsResponse()
  async handle(
    @Session() session: UserSession,
    @Param("id") couponId: string,
  ): Promise<DeleteCouponResponseDto> {
    const currentUser = session.user.id;

    const result = await this.deleteCouponService.execute({
      userId: currentUser,
      couponId,
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

    return {
      message: "Coupon deleted successfully",
    };
  }
}
