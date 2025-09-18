import { Injectable } from "@nestjs/common";

import { type Either, right } from "@/core/either";
import { Promotion } from "@/domain/master/enterprise/entities/promotion";

import { PromotionRepository } from "../../repositories/promotion.repository";

interface SearchPromotionsServiceRequest {
  productId?: string;
  userId?: string;
  minDiscountPercentage?: number;
  maxDiscountPercentage?: number;
  validFrom?: Date;
  validUntil?: Date;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

type SearchPromotionsServiceResponse = Either<
  never,
  {
    promotions: Promotion[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }
>;

@Injectable()
export class SearchPromotionsService {
  constructor(private promotionRepository: PromotionRepository) {}

  async execute({
    productId,
    userId,
    minDiscountPercentage,
    maxDiscountPercentage,
    validFrom,
    validUntil,
    isActive,
    page = 1,
    limit = 10,
  }: SearchPromotionsServiceRequest): Promise<SearchPromotionsServiceResponse> {
    const { promotions, total } = await this.promotionRepository.search({
      productId,
      userId,
      minDiscountPercentage,
      maxDiscountPercentage,
      validFrom,
      validUntil,
      isActive,
      page,
      limit,
    });

    const totalPages = Math.ceil(total / limit);

    return right({
      promotions,
      total,
      page,
      limit,
      totalPages,
    });
  }
}
