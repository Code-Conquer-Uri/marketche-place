import { Injectable } from "@nestjs/common";

import type { Product } from "@/domain/master/enterprise/entities/product";

import { OrganizationRepository } from "../../repositories/organization.repository";
import { ProductRepository } from "../../repositories/product.repository";

interface GetPublicProductsServiceRequest {
  limitPerOrganization?: number;
  orderBy?: "createdAt" | "updatedAt" | "title" | "price";
  orderDirection?: "asc" | "desc";
}

type GetPublicProductsServiceResponse = {
  products: Product[];
};

@Injectable()
export class GetPublicProductsService {
  constructor(
    private productRepository: ProductRepository,
    private organizationRepository: OrganizationRepository,
  ) {}

  async execute({
    limitPerOrganization = 4,
    orderBy = "createdAt",
    orderDirection = "desc",
  }: GetPublicProductsServiceRequest): Promise<GetPublicProductsServiceResponse> {
    // Busca todas as organizações
    const organizations = await this.organizationRepository.findAll();

    // Para cada organização, busca os produtos e limita
    const allProducts: Product[] = [];

    const promises = organizations.map(organization =>
      this.productRepository.findPaginated({
        page: 1,
        perPage: limitPerOrganization,
        orderBy,
        orderDirection,
        organizationId: organization.id.toString(),
      })
    );

    const results = await Promise.all(promises);

    for (const { products } of results) {
      allProducts.push(...products);
    }

    return {
      products: allProducts,
    };
  }

 
}
