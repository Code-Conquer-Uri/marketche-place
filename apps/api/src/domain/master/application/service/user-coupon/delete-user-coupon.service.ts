import { Injectable } from "@nestjs/common";

import { type Either, left, right } from "@/core/either";
import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";

import { PermissionFactory } from "../../permissions/permission-factory";
import { CouponRepository } from "../../repositories/coupon.repository";
import { ProductRepository } from "../../repositories/product.repository";
import { UserCouponRepository } from "../../repositories/user-coupon.repository";

interface DeleteUserCouponServiceRequest {
  userId: string;
  userCouponId: string;
}

type DeleteUserCouponServiceResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  {
    success: true;
  }
>;

@Injectable()
export class DeleteUserCouponService {
  constructor(
    private userCouponRepository: UserCouponRepository,
    private couponRepository: CouponRepository,
    private productRepository: ProductRepository,
    private permissionFactory: PermissionFactory,
  ) {}

  async execute({
    userId,
    userCouponId,
  }: DeleteUserCouponServiceRequest): Promise<DeleteUserCouponServiceResponse> {
    const userCoupon = await this.userCouponRepository.findById(userCouponId);

    if (!userCoupon) {
      return left(new ResourceNotFoundError());
    }

    // Get the coupon to check organization permissions
    const coupon = await this.couponRepository.findById(
      userCoupon.couponId.toString(),
    );

    if (!coupon) {
      return left(new ResourceNotFoundError());
    }

    // Get the product to check organization permissions
    const product = await this.productRepository.findById(
      coupon.productId.toString(),
    );

    if (!product) {
      return left(new ResourceNotFoundError());
    }

    const organizationId = product.organizationId.toString();

    const permission = await this.permissionFactory.userCan(
      "validate",
      "coupon",
      {
        userId,
        organizationId,
      },
    );

    if (!permission.success) {
      return left(new NotAllowedError(permission.error?.message));
    }

    await this.userCouponRepository.delete(userCoupon);

    return right({
      success: true,
    });
  }
}
