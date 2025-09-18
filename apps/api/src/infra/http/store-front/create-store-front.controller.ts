import {
  BadRequestException,
  Body,
  Controller,
  Post,
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
import { CreateStoreFrontService } from "@/domain/master/application/service/store-front/create-store-front.service";
import {
  httpStoreFrontSchema,
  PrismaStoreFrontMapper,
} from "@/infra/database/prisma/mappers/prisma-store-front.mapper";

import { ApiZodGenericErrorsResponse } from "../errors/swagger-zod-errors.decorator";

const createStoreFrontBodySchema = z.object({
  organizationId: z.string(),
  logoImage: z.string(), // base64 encoded image
  bannerImage: z.string(), // base64 encoded image
  whatsappNumber: z.string().optional(),
  location: z.string(),
  theme: z.enum(["DEFAULT", "AMETHYST_HAZE", "SOLAR_DUSK"]).default("DEFAULT"),
});

export class CreateStoreFrontBodyDto extends createZodDto(
  createStoreFrontBodySchema,
) {}

const createStoreFrontResponseSchema = z.object({
  storeFront: httpStoreFrontSchema,
  message: z.string().optional(),
});

export class CreateStoreFrontResponseDto extends createZodDto(
  createStoreFrontResponseSchema,
) {}

@ApiTags("store-front")
@Controller("/store-front")
@ApiBearerAuth()
export class CreateStoreFrontController {
  constructor(private createStoreFrontService: CreateStoreFrontService) {}

  @Post()
  @ApiOperation({ summary: "Create a store front" })
  @ApiExtraModels(CreateStoreFrontResponseDto)
  @ApiResponse({
    status: 201,
    description: "Store front created successfully",
    schema: {
      $ref: getSchemaPath(CreateStoreFrontResponseDto),
    },
  })
  @ApiBody({
    type: CreateStoreFrontBodyDto,
  })
  @ApiZodGenericErrorsResponse()
  async handle(
    @Session() session: UserSession,
    @Body() body: CreateStoreFrontBodyDto,
  ): Promise<CreateStoreFrontResponseDto> {
    const { organizationId, logoImage, bannerImage, whatsappNumber, location, theme } = body;

    const currentUser = session.user.id;

    // Convert base64 strings to Buffers
    const logoImageBuffer = Buffer.from(logoImage, "base64");
    const bannerImageBuffer = Buffer.from(bannerImage, "base64");

    const result = await this.createStoreFrontService.execute({
      userId: currentUser,
      organizationId,
      logoImage: logoImageBuffer,
      bannerImage: bannerImageBuffer,
      whatsappNumber,
      location,
      theme,
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

    const { storeFront } = result.value;

    return {
      storeFront: await PrismaStoreFrontMapper.toHttp(storeFront),
      message: "Store front created successfully",
    };
  }
}
