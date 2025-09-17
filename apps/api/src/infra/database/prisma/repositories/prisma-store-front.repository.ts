import { Injectable } from "@nestjs/common";

import type { StoreFrontRepository } from "@/domain/master/application/repositories/store-front.repository";
import type { StoreFront } from "@/domain/master/enterprise/entities/store-front";

import { PrismaStoreFrontMapper } from "../mappers/prisma-store-front.mapper";
import { PrismaService } from "../prisma.service";

@Injectable()
export class PrismaStoreFrontRepository implements StoreFrontRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(storeFront: StoreFront): Promise<void> {
    await this.prisma.storeFront.create({
      data: PrismaStoreFrontMapper.toPrisma(storeFront),
    });
  }

  async findById(id: string): Promise<StoreFront | null> {
    const storeFront = await this.prisma.storeFront.findUnique({
      where: { id },
    });

    if (!storeFront) {
      return null;
    }

    return PrismaStoreFrontMapper.toDomain(storeFront);
  }

  async findByOrganizationId(
    organizationId: string,
  ): Promise<StoreFront | null> {
    const storeFront = await this.prisma.storeFront.findUnique({
      where: { organizationId },
    });

    if (!storeFront) {
      return null;
    }

    return PrismaStoreFrontMapper.toDomain(storeFront);
  }

  async findManyByIds(ids: string[]): Promise<StoreFront[]> {
    const storeFronts = await this.prisma.storeFront.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    return storeFronts.map(PrismaStoreFrontMapper.toDomain);
  }

  async findAll(): Promise<StoreFront[]> {
    const storeFronts = await this.prisma.storeFront.findMany();

    return storeFronts.map(PrismaStoreFrontMapper.toDomain);
  }

  async save(storeFront: StoreFront): Promise<void> {
    await this.prisma.storeFront.update({
      where: { id: storeFront.id.toString() },
      data: PrismaStoreFrontMapper.toPrisma(storeFront),
    });
  }

  async delete(storeFront: StoreFront): Promise<void> {
    await this.prisma.storeFront.delete({
      where: { id: storeFront.id.toString() },
    });
  }
}
