import { Module } from "@nestjs/common";

import { PermissionFactory } from "@/domain/master/application/permissions/permission-factory";
import { CreateProductService } from "@/domain/master/application/service/product/create-product.service";
import { DeleteProductService } from "@/domain/master/application/service/product/delete-product.service";
import { GetProductService } from "@/domain/master/application/service/product/get-product.service";
import { GetProductsByOrganizationService } from "@/domain/master/application/service/product/get-products-by-organization.service";
import { GetPublicProductsService } from "@/domain/master/application/service/product/get-public-products.service";
import { SearchProductService } from "@/domain/master/application/service/product/search-product.service";
import { UpdateProductService } from "@/domain/master/application/service/product/update-product.service";
import { GetFeaturedProductsService } from "@/domain/master/application/service/product/get-featured-products.service";
import { GetSimilarProductsService } from "@/domain/master/application/service/product/get-similar-products.service";
import { StorageModule } from "@/infra/storage/storage.module";
import { CryptographyModule } from "../../cryptography/cryptography.module";
import { DatabaseModule } from "../../database/database.module";
import { CreateProductController } from "./create-product.controller";
import { DeleteProductController } from "./delete-product.controller";
import { GetProductController } from "./get-product.controller";
import { GetProductsByOrganizationController } from "./get-products-by-organization.controller";
import { GetPublicProductsController } from "./get-public-products.controller";
import { SearchProductController } from "./search-product.controller";
import { UpdateProductController } from "./update-product.controller";
import { GetFeaturedProductsController } from "./get-featured-products.controller";
import { GetSimilarProductsController } from "./get-similar-products.controller";

@Module({
  imports: [DatabaseModule, CryptographyModule, StorageModule],
  controllers: [
    CreateProductController,
    GetProductController,
    UpdateProductController,
    DeleteProductController,
    SearchProductController,
    GetProductsByOrganizationController,
    GetPublicProductsController,
    GetFeaturedProductsController,
    GetSimilarProductsController,
  ],
  providers: [
    PermissionFactory,
    CreateProductService,
    GetProductService,
    UpdateProductService,
    DeleteProductService,
    SearchProductService,
    GetProductsByOrganizationService,
    GetPublicProductsService,
    GetFeaturedProductsService,
    GetSimilarProductsService,
  ],
  exports: [],
})
export class ProductModule {}
