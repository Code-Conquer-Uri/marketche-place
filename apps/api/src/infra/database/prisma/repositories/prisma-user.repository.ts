import { Injectable } from "@nestjs/common";

import type {
  UserPaginationParams,
  UserRepository,
} from "@/domain/master/application/repositories/user.repository";
import type { User } from "@/domain/master/enterprise/entities/user";

import { PrismaUserMapper } from "../mappers/prisma-user.mapper";
import { PrismaService } from "../prisma.service";

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(user: User): Promise<void> {
    await this.prisma.user.create({
      data: PrismaUserMapper.toPrisma(user),
    });
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return null;
    }

    return PrismaUserMapper.toDomain(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return null;
    }

    return PrismaUserMapper.toDomain(user);
  }

  async findAll(): Promise<User[]> {
    const users = await this.prisma.user.findMany();

    return users.map(PrismaUserMapper.toDomain);
  }

  async findManyByIds(ids: string[]): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    return users.map(PrismaUserMapper.toDomain);
  }

  async findPaginated({
    page = 1,
    perPage = 10,
    search = "",
    orderBy = "createdAt",
    orderDirection = "asc",
  }: UserPaginationParams): Promise<{
    users: User[];
    total: number;
    pages: number;
  }> {
    const result = await this.prisma.extendedClient.user.searchPaginated({
      search,
      page,
      perPage,
      orderBy,
      order: orderDirection,
    });

    return {
      users: result.data.map(PrismaUserMapper.toDomain),
      total: result.total,
      pages: result.totalPages,
    };
  }

  async save(user: User): Promise<void> {
    await this.prisma.user.update({
      where: { id: user.id.toString() },
      data: PrismaUserMapper.toPrisma(user),
    });
  }

  async delete(user: User): Promise<void> {
    await this.prisma.user.delete({
      where: { id: user.id.toString() },
    });
  }
}
