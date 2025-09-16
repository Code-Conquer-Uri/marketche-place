import type {
  Prisma,
  Organization as PrismaOrganization,
} from "@prisma/client";
import { createZodDto } from "nestjs-zod";
import { z } from "zod";

import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import {
  Organization,
  type OrganizationProps,
} from "@/domain/master/enterprise/entities/organization";

import type { ZodCustomShape } from "../../zod-custom-shape";

export const httpOrganizationSchema = z.object<
  ZodCustomShape<OrganizationProps>
>({
  id: z.string(),

  name: z.string(),
  slug: z.string().min(3).max(255),

  logo: z.string().optional(),
  metadata: z.string().optional(),

  createdAt: z.coerce.string().optional().nullable(),
  updatedAt: z.coerce.string().optional().nullable(),
});

export class HttpOrganization extends createZodDto(httpOrganizationSchema) {}

export class PrismaOrganizationMapper {
  static toDomain(raw: PrismaOrganization): Organization {
    return Organization.create(
      {
        name: raw.name,
        slug: raw.slug ?? undefined,

        logo: raw.logo ?? undefined,
        metadata: raw.metadata ?? undefined,

        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(
    organization: Organization,
  ): Prisma.OrganizationUncheckedCreateInput {
    return {
      id: organization.id.toString(),

      name: organization.name,
      logo: organization.logo,

      metadata: organization.metadata,
      slug: organization.slug,

      createdAt: organization.createdAt,
      updatedAt: organization.updatedAt,
    };
  }

  static toHttp(organization: Organization): HttpOrganization {
    const httpOrganization = httpOrganizationSchema.parse({
      name: organization.name,
      slug: organization.slug,

      logo: organization.logo,
      metadata: organization.metadata,

      createdAt: organization.createdAt,
      updatedAt: organization.updatedAt,
    } satisfies OrganizationProps);
    return httpOrganization;
  }
}
