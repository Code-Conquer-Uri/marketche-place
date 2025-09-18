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

import { SearchOrganizationsService } from "@/domain/master/application/service/organization/search-organizations.service";
import {
  httpOrganizationSchema,
  PrismaOrganizationMapper,
} from "@/infra/database/prisma/mappers/prisma-organization.mapper";

const searchOrganizationsResponseSchema = z.object({
  organizations: z.array(httpOrganizationSchema),
  total: z.number(),
  pages: z.number(),
  currentPage: z.number(),
  perPage: z.number(),
  message: z.string().optional(),
});

export class SearchOrganizationsResponseDto extends createZodDto(
  searchOrganizationsResponseSchema,
) {}

@ApiTags("organization")
@Controller("/organization")
export class SearchOrganizationsController {
  constructor(private searchOrganizationsService: SearchOrganizationsService) {}

  @Get("/search")
  @Public()
  @ApiOperation({ summary: "Search organizations with pagination" })
  @ApiExtraModels(SearchOrganizationsResponseDto)
  @ApiResponse({
    status: 200,
    description: "Returns paginated search results for organizations",
    schema: {
      $ref: getSchemaPath(SearchOrganizationsResponseDto),
    },
  })
  @ApiQuery({
    name: "search",
    required: false,
    type: String,
    description: "Search term to filter organizations by name or slug",
  })
  @ApiQuery({
    name: "page",
    required: false,
    type: Number,
    description: "Page number for pagination (default: 1)",
  })
  @ApiQuery({
    name: "perPage",
    required: false,
    type: Number,
    description: "Number of items per page (default: 10)",
  })
  @ApiQuery({
    name: "orderBy",
    required: false,
    enum: ["createdAt", "updatedAt", "name", "slug"],
    description: "Field to order by (default: createdAt)",
  })
  @ApiQuery({
    name: "orderDirection",
    required: false,
    enum: ["asc", "desc"],
    description: "Order direction (default: desc)",
  })
  async handle(
    @Query("search") search?: string,
    @Query("page") page?: string,
    @Query("perPage") perPage?: string,
    @Query("orderBy") orderBy?: "createdAt" | "updatedAt" | "name" | "slug",
    @Query("orderDirection") orderDirection?: "asc" | "desc",
  ): Promise<SearchOrganizationsResponseDto> {
    const result = await this.searchOrganizationsService.execute({
      search,
      page: page ? parseInt(page, 10) : undefined,
      perPage: perPage ? parseInt(perPage, 10) : undefined,
      orderBy,
      orderDirection,
    });

    const {
      organizations,
      total,
      pages,
      currentPage,
      perPage: itemsPerPage,
    } = result.value;

    return {
      organizations: organizations.map(PrismaOrganizationMapper.toHttp),
      total,
      pages,
      currentPage,
      perPage: itemsPerPage,
      message: "Organizations retrieved successfully",
    };
  }
}
