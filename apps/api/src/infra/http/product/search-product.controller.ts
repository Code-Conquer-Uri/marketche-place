import {
  BadRequestException,
  Controller,
  Get,
  Query,
  UnauthorizedException,
} from "@nestjs/common";
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

import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { SearchProductService } from "@/domain/master/application/service/product/search-product.service";
import {
  httpProductSchema,
  PrismaProductMapper,
} from "@/infra/database/prisma/mappers/prisma-product.mapper";

import { ApiZodGenericErrorsResponse } from "../errors/swagger-zod-errors.decorator";

const searchProductQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  perPage: z.coerce.number().min(1).max(100).default(10),
  orderDirection: z.enum(["asc", "desc"]).default("desc"),
  orderBy: z
    .enum(["createdAt", "updatedAt", "title", "price"])
    .default("createdAt"),
  searchTerm: z.string().optional(),
  organizationId: z.string().optional(),
});

export class SearchProductQueryDto extends createZodDto(
  searchProductQuerySchema,
) {}

const searchProductResponseSchema = z.object({
  products: z.array(httpProductSchema).optional(),
  message: z.string().optional(),
  total: z.number().optional(),
  pages: z.number().optional(),
});

export class SearchProductResponseDto extends createZodDto(
  searchProductResponseSchema,
) {}

@ApiTags("products")
@Controller("/products")
@Public()
export class SearchProductController {
  constructor(private searchProductService: SearchProductService) {}

  @Get("/search")
  @ApiOperation({ summary: "Search products" })
  @ApiExtraModels(SearchProductResponseDto)
  @ApiResponse({
    status: 200,
    description: "Returns a list of products",
    schema: {
      $ref: getSchemaPath(SearchProductResponseDto),
    },
  })
  @ApiQuery({
    name: "page",
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: "perPage",
    required: false,
    type: Number,
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
  @ApiQuery({
    name: "searchTerm",
    required: false,
    type: String,
  })
  @ApiQuery({
    name: "organizationId",
    required: false,
    type: String,
  })
  @ApiZodGenericErrorsResponse()
  async handle(
    @Query() query: SearchProductQueryDto,
  ): Promise<SearchProductResponseDto> {
    const {
      page,
      perPage,
      orderDirection,
      orderBy,
      searchTerm,
      organizationId,
    } = query;

    const result = await this.searchProductService.execute({
      page,
      perPage,
      orderDirection,
      orderBy,
      searchTerm,
      organizationId,
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

    const { products, total, pages } = result.value;

    return {
      products: await Promise.all(products.map(PrismaProductMapper.toHttp)),
      total,
      pages,
    };
  }
}
