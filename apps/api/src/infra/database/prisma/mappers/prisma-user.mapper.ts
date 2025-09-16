import type { Prisma, User as PrismaUser } from "@prisma/client";
import { createZodDto } from "nestjs-zod";
import { z } from "zod";

import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { User, type UserProps } from "@/domain/master/enterprise/entities/user";

import type { ZodCustomShape } from "../../zod-custom-shape";

export const httpUserSchema = z.object<ZodCustomShape<UserProps>>({
  id: z.string(),

  name: z.string(),

  email: z.string(),
  emailVerified: z.boolean(),

  banned: z.boolean().optional(),
  banExpires: z.coerce.string().optional().nullable(),
  banReason: z.string().optional(),

  image: z.string().optional(),
  role: z.string().optional(),

  createdAt: z.coerce.string().optional().nullable(),
  updatedAt: z.coerce.string().optional().nullable(),
});

export class HttpUser extends createZodDto(httpUserSchema) {}

export class PrismaUserMapper {
  static toDomain(raw: PrismaUser): User {
    return User.create(
      {
        name: raw.name,

        email: raw.email,
        emailVerified: raw.emailVerified,

        banExpires: raw.banExpires ?? undefined,
        banned: raw.banned ?? undefined,
        banReason: raw.banReason ?? undefined,

        image: raw.image ?? undefined,

        role: raw.role ?? undefined,

        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(user: User): Prisma.UserUncheckedCreateInput {
    return {
      id: user.id.toString(),

      name: user.name,

      email: user.email,
      emailVerified: user.emailVerified,

      image: user.image,

      banExpires: user.banExpires,
      banReason: user.banReason,
      banned: user.banned,

      role: user.role,

      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  static toHttp(user: User): HttpUser {
    const httpUser = httpUserSchema.parse({
      id: user.id.toString(),

      name: user.name,

      email: user.email,
      emailVerified: user.emailVerified,

      banExpires: user.banExpires,
      banned: user.banned,
      banReason: user.banReason,

      image: user.image,
      role: user.role,

      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    } satisfies UserProps & { id: string });
    return httpUser;
  }
}
