import { Injectable } from "@nestjs/common";

import { type Either, left, right } from "@/core/either";
import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { Coupon } from "@/domain/master/enterprise/entities/coupon";

import { PermissionFactory } from "../../permissions/permission-factory";
import { CouponRepository } from "../../repositories/coupon.repository";
import { ProductRepository } from "../../repositories/product.repository";

interface UpdateCouponServiceRequest {
  userId: string;
  couponId: string;
  discountPercentage?: number;
  maxQuantity?: number;
  currentQuantity?: number;
}

type UpdateCouponServiceResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  {
    coupon: Coupon;
  }
>;

@Injectable()
export class UpdateCouponService {
  constructor(
    private couponRepository: CouponRepository,
    private productRepository: ProductRepository,
    private permissionFactory: PermissionFactory,
  ) {}

  async execute({
    userId,
    couponId,
    discountPercentage,
    maxQuantity,
    currentQuantity,
  }: UpdateCouponServiceRequest): Promise<UpdateCouponServiceResponse> {
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
      "update",
      "coupon",
      {
        userId,
        organizationId,
      },
    );

    if (!permission.success) {
      return left(new NotAllowedError(permission.error?.message));
    }

    if (discountPercentage !== undefined) {
      coupon.discountPercentage = discountPercentage;
    }

    if (maxQuantity !== undefined) {
      coupon.maxQuantity = maxQuantity;
    }

    if (currentQuantity !== undefined) {
      coupon.currentQuantity = currentQuantity;
    }

    await this.couponRepository.save(coupon);

    return right({
      coupon,
    });
  }
}
