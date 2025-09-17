import { Injectable } from "@nestjs/common";

import { type Either, left, right } from "@/core/either";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { Product } from "@/domain/master/enterprise/entities/product";

import { PermissionFactory } from "../../permissions/permission-factory";
import { ProductRepository } from "../../repositories/product.repository";

interface CreateProductServiceRequest {
  userId: string;
  organizationId: string;

  image: Buffer;
  title: string;
  description: string;
  price: number;
}

type CreateProductServiceResponse = Either<
  NotAllowedError,
  {
    product: Product;
  }
>;

@Injectable()
export class CreateProductService {
  constructor(
    private productRepository: ProductRepository,
    private permissionFactory: PermissionFactory,
  ) {}

  async execute({
    userId,
    organizationId,
    image,
    title,
    description,
    price,
  }: CreateProductServiceRequest): Promise<CreateProductServiceResponse> {
    const permission = await this.permissionFactory.userCan(
      "create",
      "product",
      {
        userId,
        organizationId,
      },
    );

    if (!permission.success) {
      return left(new NotAllowedError(permission.error?.message));
    }

    const product = Product.create({
      organizationId: new UniqueEntityID(organizationId),
      image,
      title,
      description,
      price,
    });

    await this.productRepository.create(product);

    return right({
      product,
    });
  }
}
