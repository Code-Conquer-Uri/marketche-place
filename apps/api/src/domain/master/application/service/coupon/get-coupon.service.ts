import { Injectable } from "@nestjs/common";

import { type Either, left, right } from "@/core/either";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { Coupon } from "@/domain/master/enterprise/entities/coupon";

import { CouponRepository } from "../../repositories/coupon.repository";

interface GetCouponServiceRequest {
  couponId: string;
}

type GetCouponServiceResponse = Either<
  ResourceNotFoundError,
  {
    coupon: Coupon;
  }
>;

@Injectable()
export class GetCouponService {
  constructor(private couponRepository: CouponRepository) {}

  async execute({
    couponId,
  }: GetCouponServiceRequest): Promise<GetCouponServiceResponse> {
    const coupon = await this.couponRepository.findById(couponId);

    if (!coupon) {
      return left(new ResourceNotFoundError());
    }

    return right({
      coupon,
    });
  }
}
