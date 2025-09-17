import { Module } from "@nestjs/common";
import { CouponRepository } from "@/domain/master/application/repositories/coupon.repository";
import { MemberRepository } from "@/domain/master/application/repositories/member.repository";
import { OrganizationRepository } from "@/domain/master/application/repositories/organization.repository";
import { ProductRepository } from "@/domain/master/application/repositories/product.repository";
import { PromotionRepository } from "@/domain/master/application/repositories/promotion.repository";
import { StoreFrontRepository } from "@/domain/master/application/repositories/store-front.repository";
import { UserRepository } from "@/domain/master/application/repositories/user.repository";
import { UserCouponRepository } from "@/domain/master/application/repositories/user-coupon.repository";
import { PrismaService } from "./prisma/prisma.service";
import { PrismaCouponRepository } from "./prisma/repositories/prisma-coupon.repository";
import { PrismaMemberRepository } from "./prisma/repositories/prisma-member.repository";
import { PrismaOrganizationRepository } from "./prisma/repositories/prisma-organization.repository";
import { PrismaProductRepository } from "./prisma/repositories/prisma-product.repository";
import { PrismaPromotionRepository } from "./prisma/repositories/prisma-promotion.repository";
import { PrismaStoreFrontRepository } from "./prisma/repositories/prisma-store-front.repository";
import { PrismaUserRepository } from "./prisma/repositories/prisma-user.repository";
import { PrismaUserCouponRepository } from "./prisma/repositories/prisma-user-coupon.repository";

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

    {
      provide: StoreFrontRepository,
      useClass: PrismaStoreFrontRepository,
    },
    {
      provide: ProductRepository,
      useClass: PrismaProductRepository,
    },
    {
      provide: CouponRepository,
      useClass: PrismaCouponRepository,
    },
    {
      provide: PromotionRepository,
      useClass: PrismaPromotionRepository,
    },
    {
      provide: UserCouponRepository,
      useClass: PrismaUserCouponRepository,
    },
  ],
  exports: [
    PrismaService,
    UserRepository,
    MemberRepository,
    OrganizationRepository,
    StoreFrontRepository,
    ProductRepository,
    UserCouponRepository,
    CouponRepository,
    PromotionRepository,
  ],
})
export class DatabaseModule {}
