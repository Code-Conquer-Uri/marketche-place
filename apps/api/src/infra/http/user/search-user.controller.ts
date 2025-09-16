import {
  BadRequestException,
  Controller,
  Get,
  Query,
  UnauthorizedException,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from "@nestjs/swagger";
import { Session, type UserSession } from "@thallesp/nestjs-better-auth";
import { createZodDto } from "nestjs-zod";
import { z } from "zod";

import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { SearchUserService } from "@/domain/master/application/service/user/search-user.service";
import {
  httpUserSchema,
  PrismaUserMapper,
} from "@/infra/database/prisma/mappers/prisma-user.mapper";

import { ApiZodGenericErrorsResponse } from "../errors/swagger-zod-errors.decorator";

const searchUserQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  perPage: z.coerce.number().min(1).max(100).default(10),
  orderDirection: z.enum(["asc", "desc"]).default("desc"),
  orderBy: z
    .enum(["createdAt", "updatedAt", "name", "email"])
    .default("createdAt"),
  searchTerm: z.string().optional(),
});

export class SearchUserQueryDto extends createZodDto(searchUserQuerySchema) {}

const searchUserResponseSchema = z.object({
  users: z.array(httpUserSchema).optional(),
  message: z.string().optional(),
  total: z.number().optional(),
  pages: z.number().optional(),
});

export class SearchUserResponseDto extends createZodDto(
  searchUserResponseSchema,
) {}

@ApiTags("users")
@Controller("/users")
@ApiBearerAuth()
export class SearchUserController {
  constructor(private searchUserService: SearchUserService) {}

  @Get("/search")
  @ApiOperation({ summary: "Search users" })
  @ApiExtraModels(SearchUserResponseDto)
  @ApiResponse({
    status: 200,
    description: "Returns a list of users",
    schema: {
      $ref: getSchemaPath(SearchUserResponseDto),
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
    enum: ["createdAt", "updatedAt", "name", "email"],
    default: "createdAt",
  })
  @ApiQuery({
    name: "searchTerm",
    required: false,
    type: String,
  })
  @ApiZodGenericErrorsResponse()
  async handle(
    @Session() session: UserSession,
    @Query() query: SearchUserQueryDto,
  ): Promise<SearchUserResponseDto> {
    const { page, perPage, orderDirection, orderBy, searchTerm } = query;

    const currentUser = session.user.id;

    const result = await this.searchUserService.execute({
      userId: currentUser,
      page,
      perPage,
      orderDirection,
      orderBy,
      searchTerm,
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

    const { users, total, pages } = result.value;

    return {
      users: users.map(PrismaUserMapper.toHttp),
      total,
      pages,
    };
  }
}
