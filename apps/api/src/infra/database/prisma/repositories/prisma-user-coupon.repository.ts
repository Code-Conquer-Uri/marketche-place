import { Injectable } from "@nestjs/common";
import { UserCouponRepository } from "@/domain/master/application/repositories/user-coupon.repository";
import { UserCoupon } from "@/domain/master/enterprise/entities/user-coupons";
import { PrismaUserCouponMapper } from "../mappers/prisma-user-coupon.mapper";
import { PrismaService } from "../prisma.service";

@Injectable()
export class PrismaUserCouponRepository implements UserCouponRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(userCoupon: UserCoupon): Promise<void> {
    await this.prisma.userCoupons.create({
      data: PrismaUserCouponMapper.toPrisma(userCoupon),
    });
  }

  async findById(id: string): Promise<UserCoupon | null> {
    const userCoupon = await this.prisma.userCoupons.findUnique({
      where: { id },
    });

    if (!userCoupon) {
      return null;
    }

    return PrismaUserCouponMapper.toDomain(userCoupon);
  }

  async findAll(): Promise<UserCoupon[]> {
    const usercoupons = await this.prisma.userCoupons.findMany();

    return usercoupons.map(PrismaUserCouponMapper.toDomain);
  }

  async findManyByIds(ids: string[]): Promise<UserCoupon[]> {
    const usercoupons = await this.prisma.userCoupons.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    return usercoupons.map(PrismaUserCouponMapper.toDomain);
  }

  async findManyByCouponId(couponId: string): Promise<UserCoupon[]> {
    const usercoupons = await this.prisma.userCoupons.findMany({
      where: { couponId },
    });

    return usercoupons.map(PrismaUserCouponMapper.toDomain);
  }

  async findManyByCouponIds(couponIds: string[]): Promise<UserCoupon[]> {
    const usercoupons = await this.prisma.userCoupons.findMany({
      where: {
        couponId: {
          in: couponIds,
        },
      },
    });

    return usercoupons.map(PrismaUserCouponMapper.toDomain);
  }

  async findManyByUserId(userId: string): Promise<UserCoupon[]> {
    const usercoupons = await this.prisma.userCoupons.findMany({
      where: { userId },
    });

    return usercoupons.map(PrismaUserCouponMapper.toDomain);
  }

  async findManyByUserIds(userIds: string[]): Promise<UserCoupon[]> {
    const usercoupons = await this.prisma.userCoupons.findMany({
      where: {
        userId: {
          in: userIds,
        },
      },
    });

    return usercoupons.map(PrismaUserCouponMapper.toDomain);
  }

  async save(userCoupon: UserCoupon): Promise<void> {
    await this.prisma.userCoupons.update({
      where: { id: userCoupon.id.toString() },
      data: PrismaUserCouponMapper.toPrisma(userCoupon),
    });
  }

  async delete(userCoupon: UserCoupon): Promise<void> {
    await this.prisma.userCoupons.delete({
      where: { id: userCoupon.id.toString() },
    });
  }
}
