import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
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
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { GetStoreFrontService } from "@/domain/master/application/service/store-front/get-store-front.service";
import {
  httpStoreFrontSchema,
  PrismaStoreFrontMapper,
} from "@/infra/database/prisma/mappers/prisma-store-front.mapper";

import { ApiZodGenericErrorsResponse } from "../errors/swagger-zod-errors.decorator";

const getStoreFrontQuerySchema = z.object({
  organizationId: z.string(),
});

export class GetStoreFrontQueryDto extends createZodDto(
  getStoreFrontQuerySchema,
) {}

const getStoreFrontResponseSchema = z.object({
  storeFront: httpStoreFrontSchema,
  message: z.string().optional(),
});

export class GetStoreFrontResponseDto extends createZodDto(
  getStoreFrontResponseSchema,
) {}

@ApiTags("store-front")
@Controller("/store-front")
@Public()
export class GetStoreFrontController {
  constructor(private getStoreFrontService: GetStoreFrontService) {}

  @Get()
  @ApiOperation({ summary: "Get a store front" })
  @ApiExtraModels(GetStoreFrontResponseDto)
  @ApiResponse({
    status: 200,
    description: "Returns the store front",
    schema: {
      $ref: getSchemaPath(GetStoreFrontResponseDto),
    },
  })
  @ApiQuery({
    name: "organizationId",
    required: true,
    type: String,
  })
  @ApiZodGenericErrorsResponse()
  async handle(
    @Query() query: GetStoreFrontQueryDto,
  ): Promise<GetStoreFrontResponseDto> {
    const { organizationId } = query;

    const result = await this.getStoreFrontService.execute({
      organizationId,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case NotAllowedError:
          throw new UnauthorizedException(error.message);
        case ResourceNotFoundError:
          throw new NotFoundException("Store front not found");
        default:
          throw new BadRequestException(error.message);
      }
    }

    const { storeFront } = result.value;

    return {
      storeFront: await PrismaStoreFrontMapper.toHttp(storeFront),
      message: "Store front retrieved successfully",
    };
  }
}
