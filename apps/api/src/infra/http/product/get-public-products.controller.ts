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

import { GetPublicProductsService } from "@/domain/master/application/service/product/get-public-products.service";
import {
  httpProductSchema,
  PrismaProductMapper,
} from "@/infra/database/prisma/mappers/prisma-product.mapper";

import { ApiZodGenericErrorsResponse } from "../errors/swagger-zod-errors.decorator";

const getPublicProductsQuerySchema = z.object({
  limitPerOrganization: z.coerce.number().min(1).max(50).default(10),
  orderDirection: z.enum(["asc", "desc"]).default("desc"),
  orderBy: z
    .enum(["createdAt", "updatedAt", "title", "price"])
    .default("createdAt"),
});

export class GetPublicProductsQueryDto extends createZodDto(
  getPublicProductsQuerySchema,
) {}

const getPublicProductsResponseSchema = z.object({
  products: z.array(httpProductSchema),
  message: z.string().optional(),
});

export class GetPublicProductsResponseDto extends createZodDto(
  getPublicProductsResponseSchema,
) {}

@ApiTags("products")
@Controller("/products")
@Public()
export class GetPublicProductsController {
  constructor(private getPublicProductsService: GetPublicProductsService) {}

  @Get("/public")
  @ApiOperation({ summary: "Get public products from all organizations" })
  @ApiExtraModels(GetPublicProductsResponseDto)
  @ApiResponse({
    status: 200,
    description: "Returns public products from all organizations",
    schema: {
      $ref: getSchemaPath(GetPublicProductsResponseDto),
    },
  })
  @ApiQuery({
    name: "limitPerOrganization",
    required: false,
    type: Number,
    description: "Maximum number of products per organization",
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
    @Query() query: GetPublicProductsQueryDto,
  ): Promise<GetPublicProductsResponseDto> {
    const { limitPerOrganization, orderBy, orderDirection } = query;

    const result = await this.getPublicProductsService.execute({
      limitPerOrganization,
      orderBy,
      orderDirection,
    });

    return {
      products: await Promise.all(
        result.products.map(PrismaProductMapper.toHttp),
      ),
      message: "Public products retrieved successfully",
    };
  }
}
