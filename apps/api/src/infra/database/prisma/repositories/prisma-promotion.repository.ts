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

  async search(params: {
    productId?: string;
    userId?: string;
    minDiscountPercentage?: number;
    maxDiscountPercentage?: number;
    validFrom?: Date;
    validUntil?: Date;
    isActive?: boolean;
    page?: number;
    limit?: number;
  }): Promise<{ promotions: Promotion[]; total: number }> {
    const {
      productId,
      userId,
      minDiscountPercentage,
      maxDiscountPercentage,
      validFrom,
      validUntil,
      isActive,
      page = 1,
      limit = 10,
    } = params;

    const where: {
      productId?: string;
      userId?: string;
      discountPercentage?: { gte?: number; lte?: number };
      validUntil?: { gte?: Date; lte?: Date; lt?: Date };
    } = {};

    if (productId) {
      where.productId = productId;
    }

    if (userId) {
      where.userId = userId;
    }

    if (
      minDiscountPercentage !== undefined ||
      maxDiscountPercentage !== undefined
    ) {
      where.discountPercentage = {};
      if (minDiscountPercentage !== undefined) {
        where.discountPercentage.gte = minDiscountPercentage;
      }
      if (maxDiscountPercentage !== undefined) {
        where.discountPercentage.lte = maxDiscountPercentage;
      }
    }

    if (validFrom || validUntil) {
      where.validUntil = {};
      if (validFrom) {
        where.validUntil.gte = validFrom;
      }
      if (validUntil) {
        where.validUntil.lte = validUntil;
      }
    }

    if (isActive !== undefined) {
      const now = new Date();
      if (isActive) {
        where.validUntil = {
          ...where.validUntil,
          gte: now,
        };
      } else {
        where.validUntil = {
          ...where.validUntil,
          lt: now,
        };
      }
    }

    const skip = (page - 1) * limit;

    const [promotions, total] = await Promise.all([
      this.prisma.promotion.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
      }),
      this.prisma.promotion.count({
        where,
      }),
    ]);

    return {
      promotions: promotions.map(PrismaPromotionMapper.toDomain),
      total,
    };
  }
}
