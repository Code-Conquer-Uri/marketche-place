import { Injectable } from "@nestjs/common";

import { type Either, left, right } from "@/core/either";
import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { UserCoupon } from "@/domain/master/enterprise/entities/user-coupons";

import { PermissionFactory } from "../../permissions/permission-factory";
import { UserCouponRepository } from "../../repositories/user-coupon.repository";

interface SearchUserCouponsServiceRequest {
  userId: string;
  couponId?: string;
  page?: number;
  limit?: number;
}

type SearchUserCouponsServiceResponse = Either<
  NotAllowedError,
  {
    userCoupons: UserCoupon[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }
>;

@Injectable()
export class SearchUserCouponsService {
  constructor(
    private userCouponRepository: UserCouponRepository,
    private permissionFactory: PermissionFactory,
  ) {}

  async execute({
    userId,
    couponId,
    page = 1,
    limit = 10,
  }: SearchUserCouponsServiceRequest): Promise<SearchUserCouponsServiceResponse> {
    const permission = await this.permissionFactory.userCan(
      "create",
      "coupon",
      {
        userId,
      },
    );

    if (!permission.success) {
      return left(new NotAllowedError(permission.error?.message));
    }

    const { userCoupons, total } = await this.userCouponRepository.search({
      userId,
      couponId,
      page,
      limit,
    });

    const totalPages = Math.ceil(total / limit);

    return right({
      userCoupons,
      total,
      page,
      limit,
      totalPages,
    });
  }
}
