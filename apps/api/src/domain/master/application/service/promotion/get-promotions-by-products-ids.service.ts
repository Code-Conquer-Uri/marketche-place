import { Injectable } from "@nestjs/common";

import { Promotion } from "@/domain/master/enterprise/entities/promotion";

import { PromotionRepository } from "../../repositories/promotion.repository";

interface GetPromotionsByProductsIdsServiceRequest {
  productIds: string[];
}

type GetPromotionsByProductsIdsServiceResponse = {
  promotions: Promotion[];
};

@Injectable()
export class GetPromotionsByProductsIdsService {
  constructor(private promotionRepository: PromotionRepository) {}

  async execute({
    productIds,
  }: GetPromotionsByProductsIdsServiceRequest): Promise<GetPromotionsByProductsIdsServiceResponse> {
    const promotions =
      await this.promotionRepository.findManyByProductIds(productIds);

    return {
      promotions,
    };
  }
}
