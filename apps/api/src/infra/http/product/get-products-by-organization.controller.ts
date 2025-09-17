import { BadRequestException, Controller, Get, Query } from "@nestjs/common";
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

import { GetProductsByOrganizationService } from "@/domain/master/application/service/product/get-products-by-organization.service";
import {
  httpProductSchema,
  PrismaProductMapper,
} from "@/infra/database/prisma/mappers/prisma-product.mapper";

import { ApiZodGenericErrorsResponse } from "../errors/swagger-zod-errors.decorator";

const getProductsByOrganizationQuerySchema = z.object({
  organizationId: z.string(),
});

export class GetProductsByOrganizationQueryDto extends createZodDto(
  getProductsByOrganizationQuerySchema,
) {}

const getProductsByOrganizationResponseSchema = z.object({
  products: z.array(httpProductSchema),
  message: z.string().optional(),
});

export class GetProductsByOrganizationResponseDto extends createZodDto(
  getProductsByOrganizationResponseSchema,
) {}

@ApiTags("products")
@Controller("/products")
@Public()
export class GetProductsByOrganizationController {
  constructor(
    private getProductsByOrganizationService: GetProductsByOrganizationService,
  ) {}

  @Get("/organization")
  @ApiOperation({ summary: "Get products by organization" })
  @ApiExtraModels(GetProductsByOrganizationResponseDto)
  @ApiResponse({
    status: 200,
    description: "Returns products for the specified organization",
    schema: {
      $ref: getSchemaPath(GetProductsByOrganizationResponseDto),
    },
  })
  @ApiQuery({
    name: "organizationId",
    required: true,
    type: String,
  })
  @ApiZodGenericErrorsResponse()
  async handle(
    @Query() query: GetProductsByOrganizationQueryDto,
  ): Promise<GetProductsByOrganizationResponseDto> {
    const { organizationId } = query;

    const result = await this.getProductsByOrganizationService.execute({
      organizationId,
    });

    if (result.isLeft()) {
      const error = result.value;

      throw new BadRequestException(error.message);
    }

    const { products } = result.value;

    return {
      products: await Promise.all(products.map(PrismaProductMapper.toHttp)),
      message: "Products retrieved successfully",
    };
  }
}
