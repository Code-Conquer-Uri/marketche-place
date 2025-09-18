import { Injectable } from "@nestjs/common";

import { type Either, left, right } from "@/core/either";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { Organization } from "@/domain/master/enterprise/entities/organization";

import { OrganizationRepository } from "../../repositories/organization.repository";

interface GetOrganizationBySlugServiceRequest {
  slug: string;
}

type GetOrganizationBySlugServiceResponse = Either<
  ResourceNotFoundError,
  {
    organization: Organization;
  }
>;

@Injectable()
export class GetOrganizationBySlugService {
  constructor(private organizationRepository: OrganizationRepository) {}

  async execute({
    slug,
  }: GetOrganizationBySlugServiceRequest): Promise<GetOrganizationBySlugServiceResponse> {
    const organization = await this.organizationRepository.findBySlug(slug);

    if (!organization) {
      return left(new ResourceNotFoundError());
    }

    return right({
      organization,
    });
  }
}
