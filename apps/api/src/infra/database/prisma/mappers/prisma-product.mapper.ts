import type { Prisma, Product as PrismaProduct } from "@prisma/client";
import { createZodDto } from "nestjs-zod";
import { z } from "zod";

import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import {
  Product,
  type ProductProps,
} from "@/domain/master/enterprise/entities/product";
import {
  convertToWebPBase64,
  generateImageBlur,
} from "@/utils/image-processing";
import type { ZodCustomShape } from "../../zod-custom-shape";

export const httpProductSchema = z.object<
  ZodCustomShape<ProductProps & { imageBlur: Buffer }>
>({
  id: z.string(),
  description: z.string(),
  image: z.string(),
  imageBlur: z.string(),
  price: z.number(),

  title: z.string(),
  organizationId: z.string(),

  createdAt: z.coerce.string().optional().nullable(),
  updatedAt: z.coerce.string().optional().nullable(),
});

export class HttpProduct extends createZodDto(httpProductSchema) {}

export class PrismaProductMapper {
  static toDomain(raw: PrismaProduct): Product {
    const buffer = Buffer.from(raw.image);
    return Product.create(
      {
        description: raw.description,
        image: buffer,

        organizationId: new UniqueEntityID(raw.organizationId),
        price: raw.price.toNumber(),
        title: raw.title,

        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(product: Product): Prisma.ProductUncheckedCreateInput {
    return {
      id: product.id.toString(),

      description: product.description,
      image: product.image,

      organizationId: product.organizationId.toString(),
      price: product.price,
      title: product.title,

      createdAt: product.createdAt ?? undefined,
      updatedAt: product.updatedAt ?? undefined,
    };
  }

  static async toHttp(product: Product): Promise<HttpProduct> {
    const [imageBlur, imageUrl] = await Promise.all([
      generateImageBlur(product.image),
      convertToWebPBase64(product.image),
    ]);

    const httpProduct = httpProductSchema.parse({
      id: product.id.toString(),

      description: product.description,
      image: imageUrl,
      imageBlur,
      organizationId: product.organizationId.toString(),
      price: product.price,
      title: product.title,

      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    } satisfies Omit<ProductProps, "organizationId" | "image"> & {
      id: string;
      organizationId: string;
      image: string;
      imageBlur: string;
    });
    return httpProduct;
  }
}
