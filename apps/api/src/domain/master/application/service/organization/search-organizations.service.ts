import { Injectable } from "@nestjs/common";

import { type Either, right } from "@/core/either";
import { Organization } from "@/domain/master/enterprise/entities/organization";

import { OrganizationRepository } from "../../repositories/organization.repository";

interface SearchOrganizationsServiceRequest {
  search?: string;
  page?: number;
  perPage?: number;
  orderBy?: "createdAt" | "updatedAt" | "name" | "slug";
  orderDirection?: "asc" | "desc";
}

type SearchOrganizationsServiceResponse = Either<
  never,
  {
    organizations: Organization[];
    total: number;
    pages: number;
    currentPage: number;
    perPage: number;
  }
>;

@Injectable()
export class SearchOrganizationsService {
  constructor(private organizationRepository: OrganizationRepository) {}

  async execute({
    search,
    page = 1,
    perPage = 10,
    orderBy = "createdAt",
    orderDirection = "desc",
  }: SearchOrganizationsServiceRequest): Promise<SearchOrganizationsServiceResponse> {
    const result = await this.organizationRepository.findPaginated({
      search,
      page,
      perPage,
      orderBy,
      orderDirection,
    });

    return right({
      organizations: result.organizations,
      total: result.total,
      pages: result.pages,
      currentPage: page,
      perPage,
    });
  }
}
