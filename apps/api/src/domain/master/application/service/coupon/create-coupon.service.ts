import { Injectable } from "@nestjs/common";

import { type Either, left, right } from "@/core/either";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { Coupon } from "@/domain/master/enterprise/entities/coupon";

import { PermissionFactory } from "../../permissions/permission-factory";
import { CouponRepository } from "../../repositories/coupon.repository";
import { ProductRepository } from "../../repositories/product.repository";

interface CreateCouponServiceRequest {
  userId: string;
  productId: string;
  discountPercentage: number;
  maxQuantity: number;
}

type CreateCouponServiceResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  {
    coupon: Coupon;
  }
>;

@Injectable()
export class CreateCouponService {
  constructor(
    private couponRepository: CouponRepository,
    private productRepository: ProductRepository,
    private permissionFactory: PermissionFactory,
  ) {}

  async execute({
    userId,
    productId,
    discountPercentage,
    maxQuantity,
  }: CreateCouponServiceRequest): Promise<CreateCouponServiceResponse> {
    // First, check if the product exists and get its organization
    const product = await this.productRepository.findById(productId);

    if (!product) {
      return left(new ResourceNotFoundError());
    }

    const organizationId = product.organizationId.toString();

    // Check if user has permission to create coupons for this product's organization
    const permission = await this.permissionFactory.userCan(
      "create",
      "coupon",
      {
        userId,
        organizationId,
      },
    );

    if (!permission.success) {
      return left(new NotAllowedError(permission.error?.message));
    }

    const coupon = Coupon.create({
      productId: new UniqueEntityID(productId),
      userId: new UniqueEntityID(userId),
      discountPercentage,
      maxQuantity,
      currentQuantity: 0,
    });

    await this.couponRepository.create(coupon);

    return right({
      coupon,
    });
  }
}
