import { Injectable } from "@nestjs/common";

import { type Either, left, right } from "@/core/either";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { Promotion } from "@/domain/master/enterprise/entities/promotion";

import { PermissionFactory } from "../../permissions/permission-factory";
import { ProductRepository } from "../../repositories/product.repository";
import { PromotionRepository } from "../../repositories/promotion.repository";

interface CreatePromotionServiceRequest {
  userId: string;
  productId: string;
  discountPercentage: number;
  validUntil: Date;
}

type CreatePromotionServiceResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  {
    promotion: Promotion;
  }
>;

@Injectable()
export class CreatePromotionService {
  constructor(
    private promotionRepository: PromotionRepository,
    private productRepository: ProductRepository,
    private permissionFactory: PermissionFactory,
  ) {}

  async execute({
    userId,
    productId,
    discountPercentage,
    validUntil,
  }: CreatePromotionServiceRequest): Promise<CreatePromotionServiceResponse> {
    // First, check if the product exists and get its organization
    const product = await this.productRepository.findById(productId);

    if (!product) {
      return left(new ResourceNotFoundError());
    }

    const organizationId = product.organizationId.toString();

    // Check if user has permission to create promotions for this product's organization
    const permission = await this.permissionFactory.userCan(
      "create",
      "product",
      {
        userId,
        organizationId,
      },
    );

    if (!permission.success) {
      return left(new NotAllowedError(permission.error?.message));
    }

    const promotion = Promotion.create({
      productId: new UniqueEntityID(productId),
      userId: new UniqueEntityID(userId),
      discountPercentage,
      validUntil,
    });

    await this.promotionRepository.create(promotion);

    return right({
      promotion,
    });
  }
}
