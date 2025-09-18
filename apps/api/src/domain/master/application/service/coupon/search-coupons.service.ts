import { Injectable } from "@nestjs/common";

import { type Either, right } from "@/core/either";
import { Coupon } from "@/domain/master/enterprise/entities/coupon";

import { CouponRepository } from "../../repositories/coupon.repository";

interface SearchCouponsServiceRequest {
  productId?: string;
  userId?: string;
  minDiscountPercentage?: number;
  maxDiscountPercentage?: number;
  minQuantity?: number;
  maxQuantity?: number;
  page?: number;
  limit?: number;
}

type SearchCouponsServiceResponse = Either<
  never,
  {
    coupons: Coupon[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }
>;

@Injectable()
export class SearchCouponsService {
  constructor(private couponRepository: CouponRepository) {}

  async execute({
    productId,
    userId,
    minDiscountPercentage,
    maxDiscountPercentage,
    minQuantity,
    maxQuantity,
    page = 1,
    limit = 10,
  }: SearchCouponsServiceRequest): Promise<SearchCouponsServiceResponse> {
    const { coupons, total } = await this.couponRepository.search({
      productId,
      userId,
      minDiscountPercentage,
      maxDiscountPercentage,
      minQuantity,
      maxQuantity,
      page,
      limit,
    });

    const totalPages = Math.ceil(total / limit);

    return right({
      coupons,
      total,
      page,
      limit,
      totalPages,
    });
  }
}
