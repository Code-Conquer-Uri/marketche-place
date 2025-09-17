import { Injectable } from "@nestjs/common";

import { type Either, left, right } from "@/core/either";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { Product } from "@/domain/master/enterprise/entities/product";

import { ProductRepository } from "../../repositories/product.repository";

interface GetProductServiceRequest {
  productId: string;
}

type GetProductServiceResponse = Either<
  ResourceNotFoundError,
  {
    product: Product;
  }
>;

@Injectable()
export class GetProductService {
  constructor(private productRepository: ProductRepository) {}

  async execute({
    productId,
  }: GetProductServiceRequest): Promise<GetProductServiceResponse> {
    const product = await this.productRepository.findById(productId);

    if (!product) {
      return left(new ResourceNotFoundError());
    }

    return right({
      product,
    });
  }
}
