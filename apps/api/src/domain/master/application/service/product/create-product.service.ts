import { Injectable } from "@nestjs/common";

import { type Either, left, right } from "@/core/either";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { Product } from "@/domain/master/enterprise/entities/product";
import { processProductImage } from "@/utils/image-processing";

import { PermissionFactory } from "../../permissions/permission-factory";
import { StorageProvider } from "../../providers/storage.provider";
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
    private storageProvider: StorageProvider,
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

    // Processa imagem (webp + blur)
    const { webpBuffer, blurDataUrl, mimeType } = await processProductImage(
      image,
      { quality: 85 },
    );

    const fileName = `${Date.now()}.webp`;
    const { stream, downloadUrl } = await this.storageProvider.getUploadStream({
      id: new UniqueEntityID().toString(),
      fileName,
      fileType: mimeType,
      folder: "products",
    });

    stream.end(webpBuffer);

    await new Promise((resolve, reject) => {
      stream.on("finish", resolve);
      stream.on("error", reject);
    });

    const product = Product.create({
      organizationId: new UniqueEntityID(organizationId),
      imageUrl: downloadUrl,
      imageBlurData: blurDataUrl,
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
