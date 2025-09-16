import { Injectable } from "@nestjs/common";

import type { MemberRepository } from "@/domain/master/application/repositories/member.repository";
import type { Member } from "@/domain/master/enterprise/entities/member";

import { PrismaMemberMapper } from "../mappers/prisma-member.mapper";
import { PrismaService } from "../prisma.service";

@Injectable()
export class PrismaMemberRepository implements MemberRepository {
  constructor(private readonly prisma: PrismaService) {}
  async create(member: Member): Promise<void> {
    const data = PrismaMemberMapper.toPrisma(member);
    await this.prisma.member.create({
      data,
    });
  }

  async findById(id: string): Promise<Member | null> {
    const member = await this.prisma.member.findUnique({
      where: { id },
    });

    if (!member) {
      return null;
    }

    return PrismaMemberMapper.toDomain(member);
  }

  async findByOrganizationId(organizationId: string): Promise<Member[]> {
    const members = await this.prisma.member.findMany({
      where: { organizationId },
    });

    return members.map(PrismaMemberMapper.toDomain);
  }

  async findByUserId(userId: string): Promise<Member[]> {
    const member = await this.prisma.member.findMany({
      where: { userId },
    });

    return member.map(PrismaMemberMapper.toDomain);
  }

  async findByUserIdAndOrganizationId(
    userId: string,
    organizationId: string,
  ): Promise<Member | null> {
    const member = await this.prisma.member.findFirst({
      where: { userId, organizationId },
    });

    if (!member) {
      return null;
    }

    return PrismaMemberMapper.toDomain(member);
  }

  async findManyByIds(ids: string[]): Promise<Member[]> {
    const members = await this.prisma.member.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    return members.map(PrismaMemberMapper.toDomain);
  }

  async findManyByOrganizationIds(
    organizationIds: string[],
  ): Promise<Member[]> {
    const members = await this.prisma.member.findMany({
      where: {
        organizationId: {
          in: organizationIds,
        },
      },
    });

    return members.map(PrismaMemberMapper.toDomain);
  }

  async findManyByUserIds(userIds: string[]): Promise<Member[]> {
    const members = await this.prisma.member.findMany({
      where: {
        userId: {
          in: userIds,
        },
      },
    });

    return members.map(PrismaMemberMapper.toDomain);
  }

  async findManyByUserIdsAndOrganizationIds(
    userIds: string[],
    organizationIds: string[],
  ): Promise<Member[]> {
    const members = await this.prisma.member.findMany({
      where: {
        AND: [
          {
            userId: {
              in: userIds,
            },
          },
          {
            organizationId: {
              in: organizationIds,
            },
          },
        ],
      },
    });

    return members.map(PrismaMemberMapper.toDomain);
  }

  async findAll(): Promise<Member[]> {
    const members = await this.prisma.member.findMany();

    return members.map(PrismaMemberMapper.toDomain);
  }

  async save(member: Member): Promise<void> {
    const data = PrismaMemberMapper.toPrisma(member);
    await this.prisma.member.update({
      where: { id: member.id.toString() },
      data,
    });
  }

  async delete(member: Member): Promise<void> {
    await this.prisma.member.delete({
      where: { id: member.id.toString() },
    });
  }
}
