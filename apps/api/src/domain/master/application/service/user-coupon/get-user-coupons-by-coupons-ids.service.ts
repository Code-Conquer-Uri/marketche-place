import { Injectable } from "@nestjs/common";

import { UserCoupon } from "@/domain/master/enterprise/entities/user-coupons";

import { UserCouponRepository } from "../../repositories/user-coupon.repository";

interface GetUserCouponsByCouponsIdsServiceRequest {
  couponIds: string[];
}

type GetUserCouponsByCouponsIdsServiceResponse = {
  userCoupons: UserCoupon[];
};

@Injectable()
export class GetUserCouponsByCouponsIdsService {
  constructor(private userCouponRepository: UserCouponRepository) {}

  async execute({
    couponIds,
  }: GetUserCouponsByCouponsIdsServiceRequest): Promise<GetUserCouponsByCouponsIdsServiceResponse> {
    const userCoupons =
      await this.userCouponRepository.findManyByCouponIds(couponIds);

    return {
      userCoupons,
    };
  }
}
