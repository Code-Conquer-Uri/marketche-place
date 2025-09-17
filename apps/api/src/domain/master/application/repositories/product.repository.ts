import { Repository } from "@/core/repositories/repository";
import { Product } from "../../enterprise/entities/product";

export type ProductPaginationParams = {
  page: number;
  perPage: number;

  orderBy?: "createdAt" | "updatedAt" | "title" | "price";
  orderDirection?: "asc" | "desc";

  search?: string;
  organizationId?: string;
};

export abstract class ProductRepository extends Repository<Product> {
  abstract findManyByOrganizationId(organizationId: string): Promise<Product[]>;

  abstract findManyByOrganizationIds(
    organizationIds: string[],
  ): Promise<Product[]>;

  abstract findPaginated(props: ProductPaginationParams): Promise<{
    products: Product[];
    total: number;
    pages: number;
  }>;
}
