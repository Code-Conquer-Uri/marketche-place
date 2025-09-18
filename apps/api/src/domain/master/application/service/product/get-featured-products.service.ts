import { Injectable } from "@nestjs/common";

import { type Either, right } from "@/core/either";
import type { Product } from "@/domain/master/enterprise/entities/product";

import { OrganizationRepository } from "../../repositories/organization.repository";
import { ProductRepository } from "../../repositories/product.repository";

interface GetFeaturedProductsServiceRequest {
  limit?: number;
  orderBy?: "createdAt" | "updatedAt" | "title" | "price";
  orderDirection?: "asc" | "desc";
}

type GetFeaturedProductsServiceResponse = Either<
  never,
  {
    products: Product[];
  }
>;

@Injectable()
export class GetFeaturedProductsService {
  constructor(
    private productRepository: ProductRepository,
    private organizationRepository: OrganizationRepository,
  ) {}

  async execute({
    limit = 20,
    orderBy = "createdAt",
    orderDirection = "desc",
  }: GetFeaturedProductsServiceRequest): Promise<GetFeaturedProductsServiceResponse> {
    // Busca todas as organizações
    const organizations = await this.organizationRepository.findAll();

    // Para cada organização, busca os produtos mais recentes
    const allProducts: Product[] = [];

    const promises = organizations.map((organization) =>
      this.productRepository.findPaginated({
        page: 1,
        perPage: Math.ceil(limit / organizations.length), // Distribui o limite entre organizações
        orderBy,
        orderDirection,
        organizationId: organization.id.toString(),
      }),
    );

    const results = await Promise.all(promises);

    for (const { products } of results) {
      allProducts.push(...products);
    }

    // Ordena todos os produtos coletados e limita o resultado final
    const sortedProducts = allProducts
      .sort((a, b) => {
        const aValue = a[orderBy];
        const bValue = b[orderBy];

        // Trata valores null/undefined
        if (aValue == null && bValue == null) return 0;
        if (aValue == null) return orderDirection === "asc" ? -1 : 1;
        if (bValue == null) return orderDirection === "asc" ? 1 : -1;

        if (orderDirection === "asc") {
          return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        } else {
          return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
        }
      })
      .slice(0, limit);

    return right({
      products: sortedProducts,
    });
  }
}