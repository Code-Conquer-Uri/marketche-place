import { Entity } from "@/core/entities/entity";
import type { UniqueEntityID } from "@/core/entities/unique-entity-id";
import type { Optional } from "@/core/types/optional";

export interface OrganizationProps {
  name: string;
  slug?: string;
  logo?: string;

  createdAt: Date;
  updatedAt: Date;

  metadata?: string;
}

export class Organization extends Entity<OrganizationProps> {
  get name(): string {
    return this.props.name;
  }

  get slug(): string | undefined {
    return this.props.slug;
  }

  get logo(): string | undefined {
    return this.props.logo;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  get metadata(): string | undefined {
    return this.props.metadata;
  }

  static create(
    props: Optional<OrganizationProps, "createdAt" | "updatedAt">,
    id?: UniqueEntityID,
  ): Organization {
    const organization = new Organization(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? new Date(),
      },
      id,
    );

    return organization;
  }
}
