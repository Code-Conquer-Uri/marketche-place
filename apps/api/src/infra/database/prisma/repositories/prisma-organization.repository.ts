import { Injectable } from "@nestjs/common";
import { OrganizationRepository } from "@/domain/master/application/repositories/organization.repository";
import { Organization } from "@/domain/master/enterprise/entities/organization";
import { PrismaOrganizationMapper } from "../mappers/prisma-organization.mapper";
import { PrismaService } from "../prisma.service";

@Injectable()
export class PrismaOrganizationRepository implements OrganizationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(organization: Organization): Promise<void> {
    const data = PrismaOrganizationMapper.toPrisma(organization);

    await this.prisma.organization.create({
      data,
    });
  }

  async delete(organization: Organization): Promise<void> {
    await this.prisma.organization.delete({
      where: { id: organization.id.toString() },
    });
  }

  async findAll(): Promise<Organization[]> {
    const organizations = await this.prisma.organization.findMany();

    return organizations.map(PrismaOrganizationMapper.toDomain);
  }

  async findById(id: string): Promise<Organization | null> {
    const organization = await this.prisma.organization.findUnique({
      where: { id },
    });

    if (!organization) {
      return null;
    }

    return PrismaOrganizationMapper.toDomain(organization);
  }

  async findBySlug(slug: string): Promise<Organization | null> {
    const organization = await this.prisma.organization.findUnique({
      where: { slug },
    });

    if (!organization) {
      return null;
    }

    return PrismaOrganizationMapper.toDomain(organization);
  }

  async findManyByIds(ids: string[]): Promise<Organization[]> {
    const organizations = await this.prisma.organization.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    return organizations.map(PrismaOrganizationMapper.toDomain);
  }

  async findManyBySlugs(slugs: string[]): Promise<Organization[]> {
    const organizations = await this.prisma.organization.findMany({
      where: {
        slug: {
          in: slugs,
        },
      },
    });
    return organizations.map(PrismaOrganizationMapper.toDomain);
  }

  async save(organization: Organization): Promise<void> {
    await this.prisma.organization.update({
      where: { id: organization.id.toString() },
      data: PrismaOrganizationMapper.toPrisma(organization),
    });
  }
}
