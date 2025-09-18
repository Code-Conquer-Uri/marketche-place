import { Repository } from "@/core/repositories/repository";
import { Coupon } from "../../enterprise/entities/coupon";

export abstract class CouponRepository extends Repository<Coupon> {
  abstract findManyByProductId(organizationId: string): Promise<Coupon[]>;

  abstract findManyByProductIds(organizationIds: string[]): Promise<Coupon[]>;

  abstract findManyByUserId(userId: string): Promise<Coupon[]>;

  abstract findManyByUserIds(userIds: string[]): Promise<Coupon[]>;

  abstract search(params: {
    productId?: string;
    userId?: string;
    minDiscountPercentage?: number;
    maxDiscountPercentage?: number;
    minQuantity?: number;
    maxQuantity?: number;
    page?: number;
    limit?: number;
  }): Promise<{ coupons: Coupon[]; total: number }>;
}
