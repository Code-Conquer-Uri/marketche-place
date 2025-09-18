import { Injectable } from "@nestjs/common";

import { type Either, left, right } from "@/core/either";
import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";

import { PermissionFactory } from "../../permissions/permission-factory";
import { CouponRepository } from "../../repositories/coupon.repository";
import { ProductRepository } from "../../repositories/product.repository";

interface DeleteCouponServiceRequest {
  userId: string;
  couponId: string;
}

type DeleteCouponServiceResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  {
    success: true;
  }
>;

@Injectable()
export class DeleteCouponService {
  constructor(
    private couponRepository: CouponRepository,
    private productRepository: ProductRepository,
    private permissionFactory: PermissionFactory,
  ) {}

  async execute({
    userId,
    couponId,
  }: DeleteCouponServiceRequest): Promise<DeleteCouponServiceResponse> {
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
      "delete",
      "coupon",
      {
        userId,
        organizationId,
      },
    );

    if (!permission.success) {
      return left(new NotAllowedError(permission.error?.message));
    }

    await this.couponRepository.delete(coupon);

    return right({
      success: true,
    });
  }
}
