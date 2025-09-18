import { Injectable } from "@nestjs/common";

import { UserCoupon } from "@/domain/master/enterprise/entities/user-coupons";

import { UserCouponRepository } from "../../repositories/user-coupon.repository";

interface GetUserCouponsByCouponIdServiceRequest {
  couponId: string;
}

type GetUserCouponsByCouponIdServiceResponse = {
  userCoupons: UserCoupon[];
};

@Injectable()
export class GetUserCouponsByCouponIdService {
  constructor(private userCouponRepository: UserCouponRepository) {}

  async execute({
    couponId,
  }: GetUserCouponsByCouponIdServiceRequest): Promise<GetUserCouponsByCouponIdServiceResponse> {
    const userCoupons =
      await this.userCouponRepository.findManyByCouponId(couponId);

    return {
      userCoupons,
    };
  }
}
