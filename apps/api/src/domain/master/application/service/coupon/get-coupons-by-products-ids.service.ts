import { Injectable } from "@nestjs/common";

import { Coupon } from "@/domain/master/enterprise/entities/coupon";

import { CouponRepository } from "../../repositories/coupon.repository";

interface GetCouponsByProductsIdsServiceRequest {
  productIds: string[];
}

type GetCouponsByProductsIdsServiceResponse = {
  coupons: Coupon[];
};

@Injectable()
export class GetCouponsByProductsIdsService {
  constructor(private couponRepository: CouponRepository) {}

  async execute({
    productIds,
  }: GetCouponsByProductsIdsServiceRequest): Promise<GetCouponsByProductsIdsServiceResponse> {
    const coupons =
      await this.couponRepository.findManyByProductIds(productIds);

    return {
      coupons,
    };
  }
}
