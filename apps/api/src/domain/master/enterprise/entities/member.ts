import { Entity } from "@/core/entities/entity";
import type { UniqueEntityID } from "@/core/entities/unique-entity-id";
import type { Optional } from "@/core/types/optional";

export interface MemberProps {
  organizationId: UniqueEntityID;
  userId: UniqueEntityID;

  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export class Member extends Entity<MemberProps> {
  get organizationId(): UniqueEntityID {
    return this.props.organizationId;
  }

  get userId(): UniqueEntityID {
    return this.props.userId;
  }

  get role(): string {
    return this.props.role;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  static create(
    props: Optional<MemberProps, "createdAt" | "updatedAt">,
    id?: UniqueEntityID,
  ): Member {
    const member = new Member(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? new Date(),
      },
      id,
    );

    return member;
  }
}
