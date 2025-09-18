import { Injectable } from "@nestjs/common";

import { type Either, left, right } from "@/core/either";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { UserCoupon } from "@/domain/master/enterprise/entities/user-coupons";

import { PermissionFactory } from "../../permissions/permission-factory";
import { CouponRepository } from "../../repositories/coupon.repository";
import { ProductRepository } from "../../repositories/product.repository";
import { UserCouponRepository } from "../../repositories/user-coupon.repository";

interface CreateUserCouponServiceRequest {
  userId: string;
  couponId: string;
}

type CreateUserCouponServiceResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  {
    userCoupon: UserCoupon;
  }
>;

@Injectable()
export class CreateUserCouponService {
  constructor(
    private userCouponRepository: UserCouponRepository,
    private couponRepository: CouponRepository,
    private productRepository: ProductRepository,
    private permissionFactory: PermissionFactory,
  ) {}

  async execute({
    userId,
    couponId,
  }: CreateUserCouponServiceRequest): Promise<CreateUserCouponServiceResponse> {
    // First, check if the coupon exists
    const coupon = await this.couponRepository.findById(couponId);

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

    const userCoupon = UserCoupon.create({
      couponId: new UniqueEntityID(couponId),
      userId: new UniqueEntityID(userId),
    });

    await this.userCouponRepository.create(userCoupon);

    return right({
      userCoupon,
    });
  }
}
