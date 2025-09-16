import { Organization } from "../../enterprise/entities/organization";

export abstract class OrganizationRepository {
  abstract create(organization: Organization): Promise<void>;

  abstract findById(id: string): Promise<Organization | null>;

  abstract findBySlug(slug: string): Promise<Organization | null>;

  abstract findAll(): Promise<Organization[]>;

  abstract findManyByIds(ids: string[]): Promise<Organization[]>;

  abstract findManyBySlugs(slugs: string[]): Promise<Organization[]>;

  abstract save(organization: Organization): Promise<void>;

  abstract delete(organization: Organization): Promise<void>;
}
