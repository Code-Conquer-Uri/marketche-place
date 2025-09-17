import { Injectable } from "@nestjs/common";

import { type Either, right } from "@/core/either";
import { NotAllowedError } from "@/core/errors/not-allowed-error";
import type { Product } from "@/domain/master/enterprise/entities/product";
import { ProductRepository } from "../../repositories/product.repository";

interface SearchProductServiceRequest {
  organizationId?: string;

  searchTerm?: string;
  page?: number;
  perPage?: number;

  orderBy?: "createdAt" | "updatedAt" | "title" | "price";
  orderDirection?: "asc" | "desc";
}

type SearchProductServiceResponse = Either<
  NotAllowedError,
  {
    products: Product[];
    total: number;
    pages: number;
  }
>;

@Injectable()
export class SearchProductService {
  constructor(private productRepository: ProductRepository) {}

  async execute({
    organizationId,
    orderBy,
    orderDirection,
    page,
    perPage,
    searchTerm,
  }: SearchProductServiceRequest): Promise<SearchProductServiceResponse> {
    const { products, total, pages } =
      await this.productRepository.findPaginated({
        page: page || 1,
        perPage: perPage || 10,
        orderBy,
        orderDirection,
        search: searchTerm,
        organizationId,
      });

    return right({
      products,
      total,
      pages,
    });
  }
}
