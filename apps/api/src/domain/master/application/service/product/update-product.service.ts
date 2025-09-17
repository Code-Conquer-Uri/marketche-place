import { Injectable } from "@nestjs/common";

import { type Either, left, right } from "@/core/either";
import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { Product } from "@/domain/master/enterprise/entities/product";
import { processProductImage } from "@/utils/image-processing";

import { PermissionFactory } from "../../permissions/permission-factory";
import { StorageProvider } from "../../providers/storage.provider";
import { ProductRepository } from "../../repositories/product.repository";

interface UpdateProductServiceRequest {
  userId: string;
  productId: string;

  image?: Buffer;
  title?: string;
  description?: string;
  price?: number;
}

type UpdateProductServiceResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  {
    product: Product;
  }
>;

@Injectable()
export class UpdateProductService {
  constructor(
    private productRepository: ProductRepository,
    private permissionFactory: PermissionFactory,
    private storageProvider: StorageProvider,
  ) {}

  async execute({
    userId,
    productId,
    image,
    title,
    description,
    price,
  }: UpdateProductServiceRequest): Promise<UpdateProductServiceResponse> {
    const product = await this.productRepository.findById(productId);

    if (!product) {
      return left(new ResourceNotFoundError());
    }

    const permission = await this.permissionFactory.userCan(
      "update",
      "product",
      {
        userId,
        organizationId: product.organizationId.toString(),
      },
    );

    if (!permission.success) {
      return left(new NotAllowedError(permission.error?.message));
    }

    if (image !== undefined) {
      const { webpBuffer, blurDataUrl, mimeType } = await processProductImage(
        image,
        { quality: 85 },
      );
      const fileName = `${product.id.toString()}.webp`;
      const { stream, uploadUrl } = await this.storageProvider.getUploadStream({
        id: product.id.toString(),
        fileName,
        fileType: mimeType,
        folder: "products",
      });
      stream.end(webpBuffer);
      await new Promise((resolve, reject) => {
        stream.on("finish", resolve);
        stream.on("error", reject);
      });
      product.imageUrl = uploadUrl;
      product.imageBlurData = blurDataUrl;
    }

    if (title !== undefined) {
      product.title = title;
    }

    if (description !== undefined) {
      product.description = description;
    }

    if (price !== undefined) {
      product.price = price;
    }

    await this.productRepository.save(product);

    return right({
      product,
    });
  }
}
