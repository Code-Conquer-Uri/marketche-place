import { Injectable } from "@nestjs/common";

import { type Either, left, right } from "@/core/either";
import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";

import { PermissionFactory } from "../../permissions/permission-factory";
import { ProductRepository } from "../../repositories/product.repository";

interface DeleteProductServiceRequest {
  userId: string;
  productId: string;
}

type DeleteProductServiceResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  void
>;

@Injectable()
export class DeleteProductService {
  constructor(
    private productRepository: ProductRepository,
    private permissionFactory: PermissionFactory,
  ) {}

  async execute({
    userId,
    productId,
  }: DeleteProductServiceRequest): Promise<DeleteProductServiceResponse> {
    const product = await this.productRepository.findById(productId);

    if (!product) {
      return left(new ResourceNotFoundError());
    }

    const permission = await this.permissionFactory.userCan(
      "delete",
      "product",
      {
        userId,
        organizationId: product.organizationId.toString(),
      },
    );

    if (!permission.success) {
      return left(new NotAllowedError(permission.error?.message));
    }

    await this.productRepository.delete(product);

    return right(undefined);
  }
}
