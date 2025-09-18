import { Module } from "@nestjs/common";

import { PermissionFactory } from "@/domain/master/application/permissions/permission-factory";
import { CreatePromotionService } from "@/domain/master/application/service/promotion/create-promotion.service";
import { DeletePromotionService } from "@/domain/master/application/service/promotion/delete-promotion.service";
import { GetPromotionService } from "@/domain/master/application/service/promotion/get-promotion.service";
import { GetPromotionsByProductIdService } from "@/domain/master/application/service/promotion/get-promotions-by-product-id.service";
import { GetPromotionsByProductsIdsService } from "@/domain/master/application/service/promotion/get-promotions-by-products-ids.service";
import { SearchPromotionsService } from "@/domain/master/application/service/promotion/search-promotions.service";
import { UpdatePromotionService } from "@/domain/master/application/service/promotion/update-promotion.service";
import { CryptographyModule } from "../../cryptography/cryptography.module";
import { DatabaseModule } from "../../database/database.module";
import { CreatePromotionController } from "./create-promotion.controller";
import { DeletePromotionController } from "./delete-promotion.controller";
import { GetPromotionController } from "./get-promotion.controller";
import { GetPromotionsByProductIdController } from "./get-promotions-by-product-id.controller";
import { GetPromotionsByProductsIdsController } from "./get-promotions-by-products-ids.controller";
import { SearchPromotionsController } from "./search-promotions.controller";
import { UpdatePromotionController } from "./update-promotion.controller";

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    CreatePromotionController,
    GetPromotionController,
    UpdatePromotionController,
    DeletePromotionController,
    SearchPromotionsController,
    GetPromotionsByProductIdController,
    GetPromotionsByProductsIdsController,
  ],
  providers: [
    PermissionFactory,
    CreatePromotionService,
    GetPromotionService,
    UpdatePromotionService,
    DeletePromotionService,
    SearchPromotionsService,
    GetPromotionsByProductIdService,
    GetPromotionsByProductsIdsService,
  ],
  exports: [],
})
export class PromotionModule {}
