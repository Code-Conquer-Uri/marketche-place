import { Module } from "@nestjs/common";

import { PermissionFactory } from "@/domain/master/application/permissions/permission-factory";
import { CreateUserCouponService } from "@/domain/master/application/service/user-coupon/create-user-coupon.service";
import { DeleteUserCouponService } from "@/domain/master/application/service/user-coupon/delete-user-coupon.service";
import { GetUserCouponService } from "@/domain/master/application/service/user-coupon/get-user-coupon.service";
import { GetUserCouponsByCouponIdService } from "@/domain/master/application/service/user-coupon/get-user-coupons-by-coupon-id.service";
import { GetUserCouponsByCouponsIdsService } from "@/domain/master/application/service/user-coupon/get-user-coupons-by-coupons-ids.service";
import { SearchUserCouponsService } from "@/domain/master/application/service/user-coupon/search-user-coupons.service";
import { CryptographyModule } from "../../cryptography/cryptography.module";
import { DatabaseModule } from "../../database/database.module";
import { CreateUserCouponController } from "./create-user-coupon.controller";
import { DeleteUserCouponController } from "./delete-user-coupon.controller";
import { GetUserCouponController } from "./get-user-coupon.controller";
import { GetUserCouponsByCouponIdController } from "./get-user-coupons-by-coupon-id.controller";
import { GetUserCouponsByCouponsIdsController } from "./get-user-coupons-by-coupons-ids.controller";
import { SearchUserCouponsController } from "./search-user-coupons.controller";

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    CreateUserCouponController,
    GetUserCouponController,
    DeleteUserCouponController,
    SearchUserCouponsController,
    GetUserCouponsByCouponIdController,
    GetUserCouponsByCouponsIdsController,
  ],
  providers: [
    PermissionFactory,
    CreateUserCouponService,
    GetUserCouponService,
    DeleteUserCouponService,
    SearchUserCouponsService,
    GetUserCouponsByCouponIdService,
    GetUserCouponsByCouponsIdsService,
  ],
  exports: [],
})
export class UserCouponModule {}
