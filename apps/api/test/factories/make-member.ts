import { faker } from "@faker-js/faker";

import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import {
  Member,
  type MemberProps,
} from "@/domain/master/enterprise/entities/member";

export function makeMember(
  override: Partial<MemberProps> = {},
  id?: UniqueEntityID,
): Member {
  const member = Member.create(
    {
      role: "member",
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
      organizationId: new UniqueEntityID(),
      userId: new UniqueEntityID(),
      ...override,
    },
    id,
  );

  return member;
}
