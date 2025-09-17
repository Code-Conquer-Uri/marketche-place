import type { Prisma, Product as PrismaProduct } from "@prisma/client";
import { createZodDto } from "nestjs-zod";
import { z } from "zod";

import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import {
  Product,
  type ProductProps,
} from "@/domain/master/enterprise/entities/product";
import type { ZodCustomShape } from "../../zod-custom-shape";

// Novo schema HTTP refletindo campos já persistidos imageUrl e imageBlurData
export const httpProductSchema = z.object<
  ZodCustomShape<
    Omit<ProductProps, "organizationId" | "imageUrl" | "imageBlurData"> & {
      id: string;
      organizationId: string;
      imageUrl: string;
      imageBlurData: string;
    }
  >
>({
  id: z.string(),
  description: z.string(),
  imageUrl: z.string().url(),
  imageBlurData: z.string(),
  price: z.number(),
  title: z.string(),
  organizationId: z.string(),
  createdAt: z.coerce.string().optional().nullable(),
  updatedAt: z.coerce.string().optional().nullable(),
});

export class HttpProduct extends createZodDto(httpProductSchema) {}

export class PrismaProductMapper {
  static toDomain(raw: PrismaProduct): Product {
    // Compat: se client ainda tiver campo legacy `image` (Bytes) antes de migration aplicar
    type MaybeMigrated = PrismaProduct & {
      imageUrl?: string;
      imageBlurData?: string;
    };
    const migrated = raw as MaybeMigrated;
    const imageUrl = migrated.imageUrl ?? "";
    const imageBlurData = migrated.imageBlurData ?? "";
    return Product.create(
      {
        description: raw.description,
        imageUrl,
        imageBlurData,
        organizationId: new UniqueEntityID(raw.organizationId),
        // Prisma Decimal -> number (fallback se já for number)
        price: isDecimal(raw.price)
          ? raw.price.toNumber()
          : (raw.price as unknown as number),
        title: raw.title,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(product: Product): Prisma.ProductUncheckedCreateInput {
    const data = {
      id: product.id.toString(),
      description: product.description,
      // Campos novos
      imageUrl: product.imageUrl as unknown as string,
      imageBlurData: product.imageBlurData as unknown as string,
      organizationId: product.organizationId.toString(),
      price: product.price,
      title: product.title,
      createdAt: product.createdAt ?? undefined,
      updatedAt: product.updatedAt ?? undefined,
    } as unknown as Prisma.ProductUncheckedCreateInput; // Cast até regenerar tipos após migration
    return data;
  }

  static async toHttp(product: Product): Promise<HttpProduct> {
    const httpProduct = httpProductSchema.parse({
      id: product.id.toString(),
      description: product.description,
      imageUrl: product.imageUrl,
      imageBlurData: product.imageBlurData,
      organizationId: product.organizationId.toString(),
      price: product.price,
      title: product.title,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    });
    return httpProduct;
  }
}

// Narrow type para detectar objeto Decimal sem importar tipo diretamente (evitar acoplamento)
function isDecimal(value: unknown): value is { toNumber: () => number } {
  if (typeof value !== "object" || value === null) return false;
  if (!("toNumber" in value)) return false;
  const candidate = value as { toNumber?: unknown };
  return typeof candidate.toNumber === "function";
}
