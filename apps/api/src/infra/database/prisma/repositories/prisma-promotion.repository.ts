import { Injectable } from "@nestjs/common";

import type { PromotionRepository } from "@/domain/master/application/repositories/promotion.repository";
import type { Promotion } from "@/domain/master/enterprise/entities/promotion";

import { PrismaPromotionMapper } from "../mappers/prisma-promotion.mapper";
import { PrismaService } from "../prisma.service";

@Injectable()
export class PrismaPromotionRepository implements PromotionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(promotion: Promotion): Promise<void> {
    await this.prisma.promotion.create({
      data: PrismaPromotionMapper.toPrisma(promotion),
    });
  }

  async findById(id: string): Promise<Promotion | null> {
    const promotion = await this.prisma.promotion.findUnique({
      where: { id },
    });

    if (!promotion) {
      return null;
    }

    return PrismaPromotionMapper.toDomain(promotion);
  }

  async findAll(): Promise<Promotion[]> {
    const promotions = await this.prisma.promotion.findMany();

    return promotions.map(PrismaPromotionMapper.toDomain);
  }

  async findManyByIds(ids: string[]): Promise<Promotion[]> {
    const promotions = await this.prisma.promotion.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    return promotions.map(PrismaPromotionMapper.toDomain);
  }

  async findManyByProductId(organizationId: string): Promise<Promotion[]> {
    const promotions = await this.prisma.promotion.findMany({
      where: { productId: organizationId },
    });

    return promotions.map(PrismaPromotionMapper.toDomain);
  }

  async findManyByProductIds(organizationIds: string[]): Promise<Promotion[]> {
    const promotions = await this.prisma.promotion.findMany({
      where: {
        productId: {
          in: organizationIds,
        },
      },
    });
    return promotions.map(PrismaPromotionMapper.toDomain);
  }

  async findManyByUserId(userId: string): Promise<Promotion[]> {
    const promotions = await this.prisma.promotion.findMany({
      where: { userId },
    });

    return promotions.map(PrismaPromotionMapper.toDomain);
  }

  async findManyByUserIds(userIds: string[]): Promise<Promotion[]> {
    const promotions = await this.prisma.promotion.findMany({
      where: {
        userId: {
          in: userIds,
        },
      },
    });

    return promotions.map(PrismaPromotionMapper.toDomain);
  }

  async save(promotion: Promotion): Promise<void> {
    await this.prisma.promotion.update({
      where: { id: promotion.id.toString() },
      data: PrismaPromotionMapper.toPrisma(promotion),
    });
  }

  async delete(promotion: Promotion): Promise<void> {
    await this.prisma.promotion.delete({
      where: { id: promotion.id.toString() },
    });
  }
}
