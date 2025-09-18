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
import { DeletePromotionService } from "@/domain/master/application/service/promotion/delete-promotion.service";

import { ApiZodGenericErrorsResponse } from "../errors/swagger-zod-errors.decorator";

const deletePromotionResponseSchema = z.object({
  message: z.string(),
});

export class DeletePromotionResponseDto extends createZodDto(
  deletePromotionResponseSchema,
) {}

@ApiTags("promotions")
@Controller("/promotions")
@ApiBearerAuth()
export class DeletePromotionController {
  constructor(private deletePromotionService: DeletePromotionService) {}

  @Delete(":id")
  @ApiOperation({ summary: "Delete a promotion" })
  @ApiExtraModels(DeletePromotionResponseDto)
  @ApiResponse({
    status: 200,
    description: "Promotion deleted successfully",
    schema: {
      $ref: getSchemaPath(DeletePromotionResponseDto),
    },
  })
  @ApiZodGenericErrorsResponse()
  async handle(
    @Session() session: UserSession,
    @Param("id") id: string,
  ): Promise<DeletePromotionResponseDto> {
    const currentUser = session.user.id;

    const result = await this.deletePromotionService.execute({
      userId: currentUser,
      promotionId: id,
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

    return {
      message: "Promotion deleted successfully",
    };
  }
}
