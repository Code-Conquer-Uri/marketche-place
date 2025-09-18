import { Injectable } from "@nestjs/common";

import { type Either, left, right } from "@/core/either";
import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";

import { PermissionFactory } from "../../permissions/permission-factory";
import { ProductRepository } from "../../repositories/product.repository";
import { PromotionRepository } from "../../repositories/promotion.repository";

interface DeletePromotionServiceRequest {
  userId: string;
  promotionId: string;
}

type DeletePromotionServiceResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  {
    success: true;
  }
>;

@Injectable()
export class DeletePromotionService {
  constructor(
    private promotionRepository: PromotionRepository,
    private productRepository: ProductRepository,
    private permissionFactory: PermissionFactory,
  ) {}

  async execute({
    userId,
    promotionId,
  }: DeletePromotionServiceRequest): Promise<DeletePromotionServiceResponse> {
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
      "delete",
      "product",
      {
        userId,
        organizationId,
      },
    );

    if (!permission.success) {
      return left(new NotAllowedError(permission.error?.message));
    }

    await this.promotionRepository.delete(promotion);

    return right({
      success: true,
    });
  }
}
