import { Injectable } from "@nestjs/common";

import { type Either, left, right } from "@/core/either";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import type { Product } from "@/domain/master/enterprise/entities/product";

import { ProductRepository } from "../../repositories/product.repository";

interface GetSimilarProductsServiceRequest {
  productId: string;
  limit?: number;
  page?: number;
}

type GetSimilarProductsServiceResponse = Either<
  ResourceNotFoundError,
  {
    products: Product[];
    total: number;
    pages: number;
  }
>;

@Injectable()
export class GetSimilarProductsService {
  constructor(private productRepository: ProductRepository) {}

  async execute({
    productId,
    limit = 10,
    page = 1,
  }: GetSimilarProductsServiceRequest): Promise<GetSimilarProductsServiceResponse> {
    // Busca o produto original
    const originalProduct = await this.productRepository.findById(productId);

    if (!originalProduct) {
      return left(new ResourceNotFoundError());
    }

    // Extrai palavras-chave da descrição (primeiras 3 palavras significativas)
    const descriptionWords = originalProduct.description
      .split(" ")
      .filter(word => word.length > 3) // Remove palavras muito curtas
      .slice(0, 3); // Pega as primeiras 3 palavras

    const searchTerm = descriptionWords.join(" ");

    // Busca produtos similares usando o search
    const { products, total, pages } = await this.productRepository.findPaginated({
      page,
      perPage: limit,
      search: searchTerm,
      orderBy: "createdAt",
      orderDirection: "desc",
    });

    // Remove o produto original dos resultados similares
    const similarProducts = products.filter(product => product.id.toString() !== productId);

    return right({
      products: similarProducts,
      total: total - (products.length - similarProducts.length), // Ajusta o total
      pages,
    });
  }
}