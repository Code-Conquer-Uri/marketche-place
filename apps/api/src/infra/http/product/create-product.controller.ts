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
import { CreateProductService } from "@/domain/master/application/service/product/create-product.service";
import {
  httpProductSchema,
  PrismaProductMapper,
} from "@/infra/database/prisma/mappers/prisma-product.mapper";

import { ApiZodGenericErrorsResponse } from "../errors/swagger-zod-errors.decorator";

const createProductBodySchema = z.object({
  organizationId: z.string(),
  image: z.string(), // base64 encoded image
  title: z.string(),
  description: z.string(),
  price: z.number().positive(),
});

export class CreateProductBodyDto extends createZodDto(
  createProductBodySchema,
) {}

const createProductResponseSchema = z.object({
  product: httpProductSchema,
  message: z.string().optional(),
});

export class CreateProductResponseDto extends createZodDto(
  createProductResponseSchema,
) {}

@ApiTags("products")
@Controller("/products")
@ApiBearerAuth()
export class CreateProductController {
  constructor(private createProductService: CreateProductService) {}

  @Post()
  @ApiOperation({ summary: "Create a product" })
  @ApiExtraModels(CreateProductResponseDto)
  @ApiResponse({
    status: 201,
    description: "Product created successfully",
    schema: {
      $ref: getSchemaPath(CreateProductResponseDto),
    },
  })
  @ApiBody({
    type: CreateProductBodyDto,
  })
  @ApiZodGenericErrorsResponse()
  async handle(
    @Session() session: UserSession,
    @Body() body: CreateProductBodyDto,
  ): Promise<CreateProductResponseDto> {
    const { organizationId, image, title, description, price } = body;

    const currentUser = session.user.id;

    // Convert base64 string to Buffer
    const imageBuffer = Buffer.from(image, "base64");

    const result = await this.createProductService.execute({
      userId: currentUser,
      organizationId,
      image: imageBuffer,
      title,
      description,
      price,
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

    const { product } = result.value;

    return {
      product: await PrismaProductMapper.toHttp(product),
      message: "Product created successfully",
    };
  }
}
