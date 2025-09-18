import { Controller, Get, Query } from "@nestjs/common";
import {
  ApiExtraModels,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from "@nestjs/swagger";
import { Public } from "@thallesp/nestjs-better-auth";
import { createZodDto } from "nestjs-zod";
import { z } from "zod";

import { GetFeaturedProductsService } from "@/domain/master/application/service/product/get-featured-products.service";
import {
  httpProductSchema,
  PrismaProductMapper,
} from "@/infra/database/prisma/mappers/prisma-product.mapper";

import { ApiZodGenericErrorsResponse } from "../errors/swagger-zod-errors.decorator";

const getFeaturedProductsQuerySchema = z.object({
  limit: z.coerce.number().min(1).max(100).default(20),
  orderDirection: z.enum(["asc", "desc"]).default("desc"),
  orderBy: z
    .enum(["createdAt", "updatedAt", "title", "price"])
    .default("createdAt"),
});

export class GetFeaturedProductsQueryDto extends createZodDto(
  getFeaturedProductsQuerySchema,
) {}

const getFeaturedProductsResponseSchema = z.object({
  products: z.array(httpProductSchema),
  message: z.string().optional(),
});

export class GetFeaturedProductsResponseDto extends createZodDto(
  getFeaturedProductsResponseSchema,
) {}

@ApiTags("products")
@Controller("/products")
@Public()
export class GetFeaturedProductsController {
  constructor(private getFeaturedProductsService: GetFeaturedProductsService) {}

  @Get("/featured")
  @ApiOperation({ summary: "Get featured products from all organizations" })
  @ApiExtraModels(GetFeaturedProductsResponseDto)
  @ApiResponse({
    status: 200,
    description: "Returns featured products from all organizations",
    schema: {
      $ref: getSchemaPath(GetFeaturedProductsResponseDto),
    },
  })
  @ApiQuery({
    name: "limit",
    required: false,
    type: Number,
    description: "Maximum number of featured products to return",
    default: 20,
  })
  @ApiQuery({
    name: "orderDirection",
    required: false,
    enum: ["asc", "desc"],
    default: "desc",
  })
  @ApiQuery({
    name: "orderBy",
    required: false,
    enum: ["createdAt", "updatedAt", "title", "price"],
    default: "createdAt",
  })
  @ApiZodGenericErrorsResponse()
  async handle(
    @Query() query: GetFeaturedProductsQueryDto,
  ): Promise<GetFeaturedProductsResponseDto> {
    const { limit, orderBy, orderDirection } = query;

    const result = await this.getFeaturedProductsService.execute({
      limit,
      orderBy,
      orderDirection,
    });

    return {
      products: await Promise.all(
        result.value.products.map(PrismaProductMapper.toHttp),
      ),
      message: "Featured products retrieved successfully",
    };
  }
}