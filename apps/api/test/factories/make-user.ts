import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";

import type { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { User, type UserProps } from "@/domain/master/enterprise/entities/user";
import { PrismaUserMapper } from "@/infra/database/prisma/mappers/prisma-user.mapper";
import type { PrismaService } from "@/infra/database/prisma/prisma.service";

export function makeUser(
  override: Partial<UserProps> = {},
  id?: UniqueEntityID,
): User {
  const user = User.create(
    {
      email: faker.internet.email(),
      name: faker.person.fullName(),
      banExpires: faker.date.future(),
      banned: false,
      banReason: faker.lorem.sentence(),
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
      emailVerified: true,
      image: faker.image.avatar(),
      role: "user",
      ...override,
    },
    id,
  );

  return user;
}

@Injectable()
export class UserFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaUser(data: Partial<UserProps> = {}): Promise<User> {
    const user = makeUser(data);

    await this.prisma.user.create({
      data: PrismaUserMapper.toPrisma(user),
    });

    return user;
  }
}
