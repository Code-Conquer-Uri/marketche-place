import { Injectable } from "@nestjs/common";

import { Coupon } from "@/domain/master/enterprise/entities/coupon";

import { CouponRepository } from "../../repositories/coupon.repository";

interface GetCouponsByProductIdServiceRequest {
  productId: string;
}

type GetCouponsByProductIdServiceResponse = {
  coupons: Coupon[];
};

@Injectable()
export class GetCouponsByProductIdService {
  constructor(private couponRepository: CouponRepository) {}

  async execute({
    productId,
  }: GetCouponsByProductIdServiceRequest): Promise<GetCouponsByProductIdServiceResponse> {
    const coupons = await this.couponRepository.findManyByProductId(productId);

    return {
      coupons,
    };
  }
}
