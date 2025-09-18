import { Injectable } from "@nestjs/common";

import { Promotion } from "@/domain/master/enterprise/entities/promotion";

import { PromotionRepository } from "../../repositories/promotion.repository";

interface GetPromotionsByProductIdServiceRequest {
  productId: string;
}

type GetPromotionsByProductIdServiceResponse = {
  promotions: Promotion[];
};

@Injectable()
export class GetPromotionsByProductIdService {
  constructor(private promotionRepository: PromotionRepository) {}

  async execute({
    productId,
  }: GetPromotionsByProductIdServiceRequest): Promise<GetPromotionsByProductIdServiceResponse> {
    const promotions =
      await this.promotionRepository.findManyByProductId(productId);

    return {
      promotions,
    };
  }
}
