import { Injectable } from "@nestjs/common";

import { type Either, left, right } from "@/core/either";
import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { Promotion } from "@/domain/master/enterprise/entities/promotion";

import { PermissionFactory } from "../../permissions/permission-factory";
import { ProductRepository } from "../../repositories/product.repository";
import { PromotionRepository } from "../../repositories/promotion.repository";

interface UpdatePromotionServiceRequest {
  userId: string;
  promotionId: string;
  discountPercentage?: number;
  validUntil?: Date;
}

type UpdatePromotionServiceResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  {
    promotion: Promotion;
  }
>;

@Injectable()
export class UpdatePromotionService {
  constructor(
    private promotionRepository: PromotionRepository,
    private productRepository: ProductRepository,
    private permissionFactory: PermissionFactory,
  ) {}

  async execute({
    userId,
    promotionId,
    discountPercentage,
    validUntil,
  }: UpdatePromotionServiceRequest): Promise<UpdatePromotionServiceResponse> {
    const promotion = await this.promotionRepository.findById(promotionId);

    if (!promotion) {
      return left(new ResourceNotFoundError());
    }

    // Get the product to check organization permissions
    const product = await this.productRepository.findById(
      promotion.productId.toString(),
    );

    if (!product) {
      return left(new ResourceNotFoundError());
    }

    const organizationId = product.organizationId.toString();

    const permission = await this.permissionFactory.userCan(
      "update",
      "product",
      {
        userId,
        organizationId,
      },
    );

    if (!permission.success) {
      return left(new NotAllowedError(permission.error?.message));
    }

    if (!promotion) {
      return left(new ResourceNotFoundError());
    }

    if (discountPercentage !== undefined) {
      promotion.discountPercentage = discountPercentage;
    }

    if (validUntil !== undefined) {
      promotion.validUntil = validUntil;
    }

    await this.promotionRepository.save(promotion);

    return right({
      promotion,
    });
  }
}
