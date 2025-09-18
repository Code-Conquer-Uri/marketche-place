import { Repository } from "@/core/repositories/repository";
import { Promotion } from "../../enterprise/entities/promotion";

export abstract class PromotionRepository extends Repository<Promotion> {
  abstract findManyByProductId(organizationId: string): Promise<Promotion[]>;

  abstract findManyByProductIds(
    organizationIds: string[],
  ): Promise<Promotion[]>;

  abstract findManyByUserId(userId: string): Promise<Promotion[]>;

  abstract findManyByUserIds(userIds: string[]): Promise<Promotion[]>;

  abstract search(params: {
    productId?: string;
    userId?: string;
    minDiscountPercentage?: number;
    maxDiscountPercentage?: number;
    validFrom?: Date;
    validUntil?: Date;
    isActive?: boolean;
    page?: number;
    limit?: number;
  }): Promise<{ promotions: Promotion[]; total: number }>;
}
