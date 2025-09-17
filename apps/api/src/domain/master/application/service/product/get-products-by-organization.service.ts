import { Injectable } from "@nestjs/common";

import { type Either, right } from "@/core/either";
import { NotAllowedError } from "@/core/errors/not-allowed-error";
import type { Product } from "@/domain/master/enterprise/entities/product";

import { ProductRepository } from "../../repositories/product.repository";

interface GetProductsByOrganizationServiceRequest {
  organizationId: string;
}

type GetProductsByOrganizationServiceResponse = Either<
  NotAllowedError,
  {
    products: Product[];
  }
>;

@Injectable()
export class GetProductsByOrganizationService {
  constructor(private productRepository: ProductRepository) {}

  async execute({
    organizationId,
  }: GetProductsByOrganizationServiceRequest): Promise<GetProductsByOrganizationServiceResponse> {
    const products =
      await this.productRepository.findManyByOrganizationId(organizationId);

    return right({
      products,
    });
  }
}
