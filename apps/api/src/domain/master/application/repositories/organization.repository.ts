import { Repository } from "@/core/repositories/repository";
import { Organization } from "../../enterprise/entities/organization";

export type OrganizationPaginationParams = {
  page: number;
  perPage: number;

  orderBy?: "createdAt" | "updatedAt" | "name" | "slug";
  orderDirection?: "asc" | "desc";

  search?: string;
};

export abstract class OrganizationRepository extends Repository<Organization> {
  abstract findBySlug(slug: string): Promise<Organization | null>;

  abstract findManyBySlugs(slugs: string[]): Promise<Organization[]>;

  abstract findPaginated(props: OrganizationPaginationParams): Promise<{
    organizations: Organization[];
    total: number;
    pages: number;
  }>;
}
