import { Injectable } from "@nestjs/common";

import { type Either, left, right } from "@/core/either";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { Promotion } from "@/domain/master/enterprise/entities/promotion";

import { PromotionRepository } from "../../repositories/promotion.repository";

interface GetPromotionServiceRequest {
  promotionId: string;
}

type GetPromotionServiceResponse = Either<
  ResourceNotFoundError,
  {
    promotion: Promotion;
  }
>;

@Injectable()
export class GetPromotionService {
  constructor(private promotionRepository: PromotionRepository) {}

  async execute({
    promotionId,
  }: GetPromotionServiceRequest): Promise<GetPromotionServiceResponse> {
    const promotion = await this.promotionRepository.findById(promotionId);

    if (!promotion) {
      return left(new ResourceNotFoundError());
    }

    return right({
      promotion,
    });
  }
}
