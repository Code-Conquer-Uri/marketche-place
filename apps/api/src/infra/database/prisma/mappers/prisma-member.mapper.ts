import type { Prisma, Member as PrismaMember } from "@prisma/client";
import { createZodDto } from "nestjs-zod";
import { z } from "zod";

import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import {
  Member,
  type MemberProps,
} from "@/domain/master/enterprise/entities/member";

import type { ZodCustomShape } from "../../zod-custom-shape";

export const httpMemberSchema = z.object<ZodCustomShape<MemberProps>>({
  id: z.string(),

  organizationId: z.string(),
  userId: z.string(),

  role: z.string(),

  createdAt: z.coerce.string().optional().nullable(),
  updatedAt: z.coerce.string().optional().nullable(),
});

export class HttpMember extends createZodDto(httpMemberSchema) {}

export class PrismaMemberMapper {
  static toDomain(raw: PrismaMember): Member {
    return Member.create(
      {
        organizationId: new UniqueEntityID(raw.organizationId),
        userId: new UniqueEntityID(raw.userId),

        role: raw.role,

        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(member: Member): Prisma.MemberUncheckedCreateInput {
    return {
      id: member.id.toString(),

      organizationId: member.organizationId.toString(),
      userId: member.userId.toString(),

      role: member.role,

      createdAt: member.createdAt,
      updatedAt: member.updatedAt,
    };
  }

  static toHttp(member: Member): HttpMember {
    const httpMember = httpMemberSchema.parse({
      organizationId: member.organizationId.toString(),
      userId: member.userId.toString(),

      role: member.role,

      createdAt: member.createdAt,
      updatedAt: member.updatedAt,
    } satisfies Omit<MemberProps, "organizationId" | "userId"> & {
      organizationId: string;
      userId: string;
    });
    return httpMember;
  }
}
