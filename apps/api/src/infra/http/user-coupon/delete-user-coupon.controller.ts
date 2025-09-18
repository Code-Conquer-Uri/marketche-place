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
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from "@nestjs/swagger";
import { Session, type UserSession } from "@thallesp/nestjs-better-auth";
import { createZodDto } from "nestjs-zod";
import { z } from "zod";

import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { DeleteUserCouponService } from "@/domain/master/application/service/user-coupon/delete-user-coupon.service";

import { ApiZodGenericErrorsResponse } from "../errors/swagger-zod-errors.decorator";

const deleteUserCouponResponseSchema = z.object({
  message: z.string(),
});

export class DeleteUserCouponResponseDto extends createZodDto(
  deleteUserCouponResponseSchema,
) {}

@ApiTags("user-coupons")
@Controller("/user-coupons")
@ApiBearerAuth()
export class DeleteUserCouponController {
  constructor(private deleteUserCouponService: DeleteUserCouponService) {}

  @Delete(":id")
  @ApiOperation({ summary: "Delete a user coupon" })
  @ApiExtraModels(DeleteUserCouponResponseDto)
  @ApiResponse({
    status: 200,
    description: "User coupon deleted successfully",
    schema: {
      $ref: getSchemaPath(DeleteUserCouponResponseDto),
    },
  })
  @ApiZodGenericErrorsResponse()
  async handle(
    @Session() session: UserSession,
    @Param("id") id: string,
  ): Promise<DeleteUserCouponResponseDto> {
    const currentUser = session.user.id;

    const result = await this.deleteUserCouponService.execute({
      userId: currentUser,
      userCouponId: id,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case NotAllowedError:
          throw new UnauthorizedException(error.message);
        case ResourceNotFoundError:
          throw new BadRequestException("User coupon not found");
        default:
          throw new BadRequestException(error.message);
      }
    }

    return {
      message: "User coupon deleted successfully",
    };
  }
}
