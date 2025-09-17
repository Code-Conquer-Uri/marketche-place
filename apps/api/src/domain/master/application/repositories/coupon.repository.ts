import { Repository } from "@/core/repositories/repository";
import { Coupon } from "../../enterprise/entities/coupon";

export abstract class CouponRepository extends Repository<Coupon> {
  abstract findManyByProductId(organizationId: string): Promise<Coupon[]>;

  abstract findManyByProductIds(organizationIds: string[]): Promise<Coupon[]>;

  abstract findManyByUserId(userId: string): Promise<Coupon[]>;

  abstract findManyByUserIds(userIds: string[]): Promise<Coupon[]>;
}
