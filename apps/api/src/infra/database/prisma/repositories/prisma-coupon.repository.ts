import { Injectable } from "@nestjs/common";

import type { CouponRepository } from "@/domain/master/application/repositories/coupon.repository";
import type { Coupon } from "@/domain/master/enterprise/entities/coupon";

import { PrismaCouponMapper } from "../mappers/prisma-coupon.mapper";
import { PrismaService } from "../prisma.service";

@Injectable()
export class PrismaCouponRepository implements CouponRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(coupon: Coupon): Promise<void> {
    await this.prisma.coupon.create({
      data: PrismaCouponMapper.toPrisma(coupon),
    });
  }

  async findById(id: string): Promise<Coupon | null> {
    const coupon = await this.prisma.coupon.findUnique({
      where: { id },
    });

    if (!coupon) {
      return null;
    }

    return PrismaCouponMapper.toDomain(coupon);
  }

  async findAll(): Promise<Coupon[]> {
    const coupons = await this.prisma.coupon.findMany();

    return coupons.map(PrismaCouponMapper.toDomain);
  }

  async findManyByIds(ids: string[]): Promise<Coupon[]> {
    const coupons = await this.prisma.coupon.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    return coupons.map(PrismaCouponMapper.toDomain);
  }

  async findManyByProductId(organizationId: string): Promise<Coupon[]> {
    const coupons = await this.prisma.coupon.findMany({
      where: { productId: organizationId },
    });

    return coupons.map(PrismaCouponMapper.toDomain);
  }

  async findManyByProductIds(organizationIds: string[]): Promise<Coupon[]> {
    const coupons = await this.prisma.coupon.findMany({
      where: {
        productId: {
          in: organizationIds,
        },
      },
    });
    return coupons.map(PrismaCouponMapper.toDomain);
  }

  async findManyByUserId(userId: string): Promise<Coupon[]> {
    const coupons = await this.prisma.coupon.findMany({
      where: { userId },
    });

    return coupons.map(PrismaCouponMapper.toDomain);
  }

  async findManyByUserIds(userIds: string[]): Promise<Coupon[]> {
    const coupons = await this.prisma.coupon.findMany({
      where: {
        userId: {
          in: userIds,
        },
      },
    });

    return coupons.map(PrismaCouponMapper.toDomain);
  }

  async save(coupon: Coupon): Promise<void> {
    await this.prisma.coupon.update({
      where: { id: coupon.id.toString() },
      data: PrismaCouponMapper.toPrisma(coupon),
    });
  }

  async delete(coupon: Coupon): Promise<void> {
    await this.prisma.coupon.delete({
      where: { id: coupon.id.toString() },
    });
  }
}
