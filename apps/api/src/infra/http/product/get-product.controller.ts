import { BadRequestException, Controller, Get, Param } from "@nestjs/common";
import {
  ApiExtraModels,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from "@nestjs/swagger";
import { Public } from "@thallesp/nestjs-better-auth";
import { createZodDto } from "nestjs-zod";
import { z } from "zod";

import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { GetProductService } from "@/domain/master/application/service/product/get-product.service";
import {
  httpProductSchema,
  PrismaProductMapper,
} from "@/infra/database/prisma/mappers/prisma-product.mapper";

import { ApiZodGenericErrorsResponse } from "../errors/swagger-zod-errors.decorator";

const getProductResponseSchema = z.object({
  product: httpProductSchema,
  message: z.string().optional(),
});

export class GetProductResponseDto extends createZodDto(
  getProductResponseSchema,
) {}

@ApiTags("products")
@Controller("/products/get-by-id")
@Public()
export class GetProductController {
  constructor(private getProductService: GetProductService) {}

  @Get(":productId")
  @ApiOperation({ summary: "Get a product by ID" })
  @ApiExtraModels(GetProductResponseDto)
  @ApiResponse({
    status: 200,
    description: "Returns the product",
    schema: {
      $ref: getSchemaPath(GetProductResponseDto),
    },
  })
  @ApiParam({
    name: "productId",
    required: true,
    type: String,
    description: "The ID of the product to retrieve",
  })
  @ApiZodGenericErrorsResponse()
  async handle(
    @Param("productId") productId: string,
  ): Promise<GetProductResponseDto> {
    const result = await this.getProductService.execute({
      productId,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new BadRequestException("Product not found");
        default:
          throw new BadRequestException(error.message);
      }
    }

    const { product } = result.value;

    return {
      product: await PrismaProductMapper.toHttp(product),
      message: "Product retrieved successfully",
    };
  }
}
