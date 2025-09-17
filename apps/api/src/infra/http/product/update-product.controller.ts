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
import { UpdateProductService } from "@/domain/master/application/service/product/update-product.service";
import {
  httpProductSchema,
  PrismaProductMapper,
} from "@/infra/database/prisma/mappers/prisma-product.mapper";

import { ApiZodGenericErrorsResponse } from "../errors/swagger-zod-errors.decorator";

const updateProductBodySchema = z.object({
  image: z.string().optional(), // base64 encoded image
  title: z.string().optional(),
  description: z.string().optional(),
  price: z.number().positive().optional(),
});

export class UpdateProductBodyDto extends createZodDto(
  updateProductBodySchema,
) {}

const updateProductResponseSchema = z.object({
  product: httpProductSchema,
  message: z.string().optional(),
});

export class UpdateProductResponseDto extends createZodDto(
  updateProductResponseSchema,
) {}

@ApiTags("products")
@Controller("/products")
@ApiBearerAuth()
export class UpdateProductController {
  constructor(private updateProductService: UpdateProductService) {}

  @Patch(":productId")
  @ApiOperation({ summary: "Update a product" })
  @ApiExtraModels(UpdateProductResponseDto)
  @ApiResponse({
    status: 200,
    description: "Product updated successfully",
    schema: {
      $ref: getSchemaPath(UpdateProductResponseDto),
    },
  })
  @ApiParam({
    name: "productId",
    required: true,
    type: String,
    description: "The ID of the product to update",
  })
  @ApiBody({
    type: UpdateProductBodyDto,
  })
  @ApiZodGenericErrorsResponse()
  async handle(
    @Session() session: UserSession,
    @Param("productId") productId: string,
    @Body() body: UpdateProductBodyDto,
  ): Promise<UpdateProductResponseDto> {
    const { image, title, description, price } = body;

    const currentUser = session.user.id;

    // Convert base64 string to Buffer if provided
    const imageBuffer = image ? Buffer.from(image, "base64") : undefined;

    const result = await this.updateProductService.execute({
      userId: currentUser,
      productId,
      image: imageBuffer,
      title,
      description,
      price,
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

    const { product } = result.value;

    return {
      product: await PrismaProductMapper.toHttp(product),
      message: "Product updated successfully",
    };
  }
}
