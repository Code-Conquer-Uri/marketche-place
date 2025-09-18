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
import { GetOrganizationBySlugService } from "@/domain/master/application/service/organization/get-organization-by-slug.service";
import {
  httpOrganizationSchema,
  PrismaOrganizationMapper,
} from "@/infra/database/prisma/mappers/prisma-organization.mapper";

import { ApiZodGenericErrorsResponse } from "../errors/swagger-zod-errors.decorator";

const getOrganizationBySlugResponseSchema = z.object({
  organization: httpOrganizationSchema,
  message: z.string().optional(),
});

export class GetOrganizationBySlugResponseDto extends createZodDto(
  getOrganizationBySlugResponseSchema,
) {}

@ApiTags("organization")
@Controller("/organization/by-slug")
export class GetOrganizationBySlugController {
  constructor(
    private getOrganizationBySlugService: GetOrganizationBySlugService,
  ) {}

  @Get("/:slug")
  @Public()
  @ApiOperation({ summary: "Get organization by slug" })
  @ApiExtraModels(GetOrganizationBySlugResponseDto)
  @ApiResponse({
    status: 200,
    description: "Returns the organization",
    schema: {
      $ref: getSchemaPath(GetOrganizationBySlugResponseDto),
    },
  })
  @ApiParam({
    name: "slug",
    required: true,
    type: String,
    description: "Organization slug",
  })
  @ApiZodGenericErrorsResponse()
  async handle(
    @Param("slug") slug: string,
  ): Promise<GetOrganizationBySlugResponseDto> {
    const result = await this.getOrganizationBySlugService.execute({
      slug,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new BadRequestException("Organization not found");
        default:
          throw new BadRequestException(error.message);
      }
    }

    const { organization } = result.value;

    return {
      organization: PrismaOrganizationMapper.toHttp(organization),
      message: "Organization retrieved successfully",
    };
  }
}
