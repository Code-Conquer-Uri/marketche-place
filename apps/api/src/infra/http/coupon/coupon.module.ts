import { Module } from "@nestjs/common";

import { PermissionFactory } from "@/domain/master/application/permissions/permission-factory";
import { CreateCouponService } from "@/domain/master/application/service/coupon/create-coupon.service";
import { DeleteCouponService } from "@/domain/master/application/service/coupon/delete-coupon.service";
import { GetCouponService } from "@/domain/master/application/service/coupon/get-coupon.service";
import { GetCouponsByProductIdService } from "@/domain/master/application/service/coupon/get-coupons-by-product-id.service";
import { GetCouponsByProductsIdsService } from "@/domain/master/application/service/coupon/get-coupons-by-products-ids.service";
import { SearchCouponsService } from "@/domain/master/application/service/coupon/search-coupons.service";
import { UpdateCouponService } from "@/domain/master/application/service/coupon/update-coupon.service";
import { CryptographyModule } from "../../cryptography/cryptography.module";
import { DatabaseModule } from "../../database/database.module";
import { CreateCouponController } from "./create-coupon.controller";
import { DeleteCouponController } from "./delete-coupon.controller";
import { GetCouponController } from "./get-coupon.controller";
import { GetCouponsByProductIdController } from "./get-coupons-by-product-id.controller";
import { GetCouponsByProductsIdsController } from "./get-coupons-by-products-ids.controller";
import { SearchCouponsController } from "./search-coupons.controller";
import { UpdateCouponController } from "./update-coupon.controller";

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    CreateCouponController,
    GetCouponController,
    UpdateCouponController,
    DeleteCouponController,
    SearchCouponsController,
    GetCouponsByProductIdController,
    GetCouponsByProductsIdsController,
  ],
  providers: [
    PermissionFactory,
    CreateCouponService,
    GetCouponService,
    UpdateCouponService,
    DeleteCouponService,
    SearchCouponsService,
    GetCouponsByProductIdService,
    GetCouponsByProductsIdsService,
  ],
  exports: [],
})
export class CouponModule {}
