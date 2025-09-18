import { Controller, Get, Param, Query } from "@nestjs/common";
import {
  ApiExtraModels,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from "@nestjs/swagger";
import { Public } from "@thallesp/nestjs-better-auth";
import { createZodDto } from "nestjs-zod";
import { z } from "zod";

import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { GetSimilarProductsService } from "@/domain/master/application/service/product/get-similar-products.service";
import {
  httpProductSchema,
  PrismaProductMapper,
} from "@/infra/database/prisma/mappers/prisma-product.mapper";

import { ApiZodGenericErrorsResponse } from "../errors/swagger-zod-errors.decorator";

const getSimilarProductsQuerySchema = z.object({
  limit: z.coerce.number().min(1).max(50).default(10),
  page: z.coerce.number().min(1).default(1),
});

export class GetSimilarProductsQueryDto extends createZodDto(
  getSimilarProductsQuerySchema,
) {}

const getSimilarProductsResponseSchema = z.object({
  products: z.array(httpProductSchema),
  total: z.number(),
  pages: z.number(),
  message: z.string().optional(),
});

export class GetSimilarProductsResponseDto extends createZodDto(
  getSimilarProductsResponseSchema,
) {}

@ApiTags("products")
@Controller("/products")
@Public()
export class GetSimilarProductsController {
  constructor(private getSimilarProductsService: GetSimilarProductsService) {}

  @Get("/:productId/similar")
  @ApiOperation({ summary: "Get similar products based on description" })
  @ApiParam({
    name: "productId",
    type: String,
    description: "ID of the product to find similar products for",
  })
  @ApiExtraModels(GetSimilarProductsResponseDto)
  @ApiResponse({
    status: 200,
    description: "Returns similar products",
    schema: {
      $ref: getSchemaPath(GetSimilarProductsResponseDto),
    },
  })
  @ApiResponse({
    status: 404,
    description: "Product not found",
  })
  @ApiQuery({
    name: "limit",
    required: false,
    type: Number,
    description: "Maximum number of similar products to return",
    default: 10,
  })
  @ApiQuery({
    name: "page",
    required: false,
    type: Number,
    description: "Page number for pagination",
    default: 1,
  })
  @ApiZodGenericErrorsResponse()
  async handle(
    @Param("productId") productId: string,
    @Query() query: GetSimilarProductsQueryDto,
  ): Promise<GetSimilarProductsResponseDto> {
    const { limit, page } = query;

    const result = await this.getSimilarProductsService.execute({
      productId,
      limit,
      page,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new ResourceNotFoundError();
        default:
          throw new Error(error.message);
      }
    }

    const { products, total, pages } = result.value;

    return {
      products: await Promise.all(products.map(PrismaProductMapper.toHttp)),
      total,
      pages,
      message: "Similar products retrieved successfully",
    };
  }
}