import {
  BadRequestException,
  Body,
  Controller,
  Patch,
  UnauthorizedException,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiBody,
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from "@nestjs/swagger";
import { Session, type UserSession } from "@thallesp/nestjs-better-auth";
import { createZodDto } from "nestjs-zod";
import { z } from "zod";

import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { UpdateStoreFrontService } from "@/domain/master/application/service/store-front/update-store-front.service";
import {
  httpStoreFrontSchema,
  PrismaStoreFrontMapper,
} from "@/infra/database/prisma/mappers/prisma-store-front.mapper";

import { ApiZodGenericErrorsResponse } from "../errors/swagger-zod-errors.decorator";

const updateStoreFrontBodySchema = z.object({
  organizationId: z.string(),
  logoImage: z.string().optional(), // base64 encoded image
  bannerImage: z.string().optional(), // base64 encoded image
  location: z.string().optional(),
  theme: z.enum(["DEFAULT", "AMETHYST_HAZE", "SOLAR_DUSK"]).optional(),
});

export class UpdateStoreFrontBodyDto extends createZodDto(
  updateStoreFrontBodySchema,
) {}

const updateStoreFrontResponseSchema = z.object({
  storeFront: httpStoreFrontSchema,
  message: z.string().optional(),
});

export class UpdateStoreFrontResponseDto extends createZodDto(
  updateStoreFrontResponseSchema,
) {}

@ApiTags("store-front")
@Controller("/store-front")
@ApiBearerAuth()
export class UpdateStoreFrontController {
  constructor(private updateStoreFrontService: UpdateStoreFrontService) {}

  @Patch()
  @ApiOperation({ summary: "Update a store front" })
  @ApiExtraModels(UpdateStoreFrontResponseDto)
  @ApiResponse({
    status: 200,
    description: "Store front updated successfully",
    schema: {
      $ref: getSchemaPath(UpdateStoreFrontResponseDto),
    },
  })
  @ApiBody({
    type: UpdateStoreFrontBodyDto,
  })
  @ApiZodGenericErrorsResponse()
  async handle(
    @Session() session: UserSession,
    @Body() body: UpdateStoreFrontBodyDto,
  ): Promise<UpdateStoreFrontResponseDto> {
    const { organizationId, logoImage, bannerImage, location, theme } = body;

    const currentUser = session.user.id;

    // Convert base64 strings to Buffers if provided
    const logoImageBuffer = logoImage
      ? Buffer.from(logoImage, "base64")
      : undefined;
    const bannerImageBuffer = bannerImage
      ? Buffer.from(bannerImage, "base64")
      : undefined;

    const result = await this.updateStoreFrontService.execute({
      userId: currentUser,
      organizationId,
      logoImage: logoImageBuffer,
      bannerImage: bannerImageBuffer,
      location,
      theme,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case NotAllowedError:
          throw new UnauthorizedException(error.message);
        case ResourceNotFoundError:
          throw new BadRequestException("Store front not found");
        default:
          throw new BadRequestException(error.message);
      }
    }

    const { storeFront } = result.value;

    return {
      storeFront: PrismaStoreFrontMapper.toHttp(storeFront),
      message: "Store front updated successfully",
    };
  }
}
