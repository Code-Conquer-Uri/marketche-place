import {
  BadRequestException,
  Controller,
  Delete,
  Param,
  UnauthorizedException,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { Session, type UserSession } from "@thallesp/nestjs-better-auth";
import { createZodDto } from "nestjs-zod";
import { z } from "zod";

import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { DeleteProductService } from "@/domain/master/application/service/product/delete-product.service";

import { ApiZodGenericErrorsResponse } from "../errors/swagger-zod-errors.decorator";

const deleteProductResponseSchema = z.object({
  message: z.string(),
});

export class DeleteProductResponseDto extends createZodDto(
  deleteProductResponseSchema,
) {}

@ApiTags("products")
@Controller("/products")
@ApiBearerAuth()
export class DeleteProductController {
  constructor(private deleteProductService: DeleteProductService) {}

  @Delete(":productId")
  @ApiOperation({ summary: "Delete a product" })
  @ApiResponse({
    status: 200,
    description: "Product deleted successfully",
    type: DeleteProductResponseDto,
  })
  @ApiParam({
    name: "productId",
    required: true,
    type: String,
    description: "The ID of the product to delete",
  })
  @ApiZodGenericErrorsResponse()
  async handle(
    @Session() session: UserSession,
    @Param("productId") productId: string,
  ): Promise<DeleteProductResponseDto> {
    const currentUser = session.user.id;

    const result = await this.deleteProductService.execute({
      userId: currentUser,
      productId,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case NotAllowedError:
          throw new UnauthorizedException(error.message);
        case ResourceNotFoundError:
          throw new BadRequestException("Product not found");
        default:
          throw new BadRequestException(error.message);
      }
    }

    return {
      message: "Product deleted successfully",
    };
  }
}
