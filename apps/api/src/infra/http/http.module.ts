import { Module } from "@nestjs/common";
import { CouponModule } from "@/infra/http/coupon/coupon.module";
import { OrganizationModule } from "@/infra/http/organization/organization.module";
import { PromotionModule } from "@/infra/http/promotion/promotion.module";
import { UserCouponModule } from "@/infra/http/user-coupon/user-coupon.module";
import { CryptographyModule } from "../cryptography/cryptography.module";
import { DatabaseModule } from "../database/database.module";
import { ProductModule } from "./product/product.module";
import { StoreFrontModule } from "./store-front/store-front.module";
import { UserModule } from "./user/user.module";

@Module({
  imports: [
    DatabaseModule,
    CryptographyModule,
    UserModule,
    StoreFrontModule,
    ProductModule,
    OrganizationModule,
    CouponModule,
    PromotionModule,
    UserCouponModule,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class HttpModule {}
