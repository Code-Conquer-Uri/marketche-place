import { Injectable } from "@nestjs/common";

import type {
  ProductPaginationParams,
  ProductRepository,
} from "@/domain/master/application/repositories/product.repository";
import type { Product } from "@/domain/master/enterprise/entities/product";

import { PrismaProductMapper } from "../mappers/prisma-product.mapper";
import { PrismaService } from "../prisma.service";

@Injectable()
export class PrismaProductRepository implements ProductRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(product: Product): Promise<void> {
    await this.prisma.product.create({
      data: PrismaProductMapper.toPrisma(product),
    });
  }

  async findById(id: string): Promise<Product | null> {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return null;
    }

    return PrismaProductMapper.toDomain(product);
  }

  async findManyByOrganizationId(organizationId: string): Promise<Product[]> {
    const products = await this.prisma.product.findMany({
      where: { organizationId },
    });

    return products.map(PrismaProductMapper.toDomain);
  }

  async findManyByOrganizationIds(
    organizationIds: string[],
  ): Promise<Product[]> {
    const products = await this.prisma.product.findMany({
      where: {
        organizationId: {
          in: organizationIds,
        },
      },
    });

    return products.map(PrismaProductMapper.toDomain);
  }

  async findAll(): Promise<Product[]> {
    const products = await this.prisma.product.findMany();

    return products.map(PrismaProductMapper.toDomain);
  }

  async findManyByIds(ids: string[]): Promise<Product[]> {
    const products = await this.prisma.product.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    return products.map(PrismaProductMapper.toDomain);
  }

  async findPaginated({
    page = 1,
    perPage = 10,
    search = "",
    orderBy = "createdAt",
    orderDirection = "asc",
    organizationId,
  }: ProductPaginationParams): Promise<{
    products: Product[];
    total: number;
    pages: number;
  }> {
    const whereClause = organizationId ? { organizationId } : undefined;

    const result = await this.prisma.extendedClient.product.searchPaginated(
      {
        search,
        page,
        perPage,
        orderBy,
        order: orderDirection,
      },
      whereClause,
    );

    return {
      products: result.data.map(PrismaProductMapper.toDomain),
      total: result.total,
      pages: result.totalPages,
    };
  }

  async save(product: Product): Promise<void> {
    await this.prisma.product.update({
      where: { id: product.id.toString() },
      data: PrismaProductMapper.toPrisma(product),
    });
  }

  async delete(product: Product): Promise<void> {
    await this.prisma.product.delete({
      where: { id: product.id.toString() },
    });
  }
}
