import { Repository } from "@/core/repositories/repository";
import { UserCoupon } from "../../enterprise/entities/user-coupons";

export abstract class UserCouponRepository extends Repository<UserCoupon> {
  abstract findManyByCouponId(organizationId: string): Promise<UserCoupon[]>;

  abstract findManyByCouponIds(
    organizationIds: string[],
  ): Promise<UserCoupon[]>;

  abstract findManyByUserId(userId: string): Promise<UserCoupon[]>;

  abstract findManyByUserIds(userIds: string[]): Promise<UserCoupon[]>;
}
