import { Injectable } from "@nestjs/common";

import { type Either, left, right } from "@/core/either";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { UserCoupon } from "@/domain/master/enterprise/entities/user-coupons";

import { UserCouponRepository } from "../../repositories/user-coupon.repository";

interface GetUserCouponServiceRequest {
  userCouponId: string;
}

type GetUserCouponServiceResponse = Either<
  ResourceNotFoundError,
  {
    userCoupon: UserCoupon;
  }
>;

@Injectable()
export class GetUserCouponService {
  constructor(private userCouponRepository: UserCouponRepository) {}

  async execute({
    userCouponId,
  }: GetUserCouponServiceRequest): Promise<GetUserCouponServiceResponse> {
    const userCoupon = await this.userCouponRepository.findById(userCouponId);

    if (!userCoupon) {
      return left(new ResourceNotFoundError());
    }

    return right({
      userCoupon,
    });
  }
}
