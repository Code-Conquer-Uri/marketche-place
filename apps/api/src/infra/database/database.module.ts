import { Module } from "@nestjs/common";

import { MemberRepository } from "@/domain/master/application/repositories/member.repository";
import { OrganizationRepository } from "@/domain/master/application/repositories/organization.repository";
import { UserRepository } from "@/domain/master/application/repositories/user.repository";
import { PrismaService } from "./prisma/prisma.service";
import { PrismaMemberRepository } from "./prisma/repositories/prisma-member.repository";
import { PrismaOrganizationRepository } from "./prisma/repositories/prisma-organization.repository";
import { PrismaUserRepository } from "./prisma/repositories/prisma-user.repository";

@Module({
  imports: [],
  providers: [
    PrismaService,
    {
      provide: UserRepository,
      useClass: PrismaUserRepository,
    },

    {
      provide: MemberRepository,
      useClass: PrismaMemberRepository,
    },

    {
      provide: OrganizationRepository,
      useClass: PrismaOrganizationRepository,
    },
  ],
  exports: [
    PrismaService,
    UserRepository,
    MemberRepository,
    OrganizationRepository,
  ],
})
export class DatabaseModule {}
