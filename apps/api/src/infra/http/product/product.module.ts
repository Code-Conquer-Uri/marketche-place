import { Module } from "@nestjs/common";

import { PermissionFactory } from "@/domain/master/application/permissions/permission-factory";
import { CreateProductService } from "@/domain/master/application/service/product/create-product.service";
import { DeleteProductService } from "@/domain/master/application/service/product/delete-product.service";
import { GetProductService } from "@/domain/master/application/service/product/get-product.service";
import { GetProductsByOrganizationService } from "@/domain/master/application/service/product/get-products-by-organization.service";
import { GetPublicProductsService } from "@/domain/master/application/service/product/get-public-products.service";
import { SearchProductService } from "@/domain/master/application/service/product/search-product.service";
import { UpdateProductService } from "@/domain/master/application/service/product/update-product.service";

import { CryptographyModule } from "../../cryptography/cryptography.module";
import { DatabaseModule } from "../../database/database.module";
import { CreateProductController } from "./create-product.controller";
import { DeleteProductController } from "./delete-product.controller";
import { GetProductController } from "./get-product.controller";
import { GetProductsByOrganizationController } from "./get-products-by-organization.controller";
import { GetPublicProductsController } from "./get-public-products.controller";
import { SearchProductController } from "./search-product.controller";
import { UpdateProductController } from "./update-product.controller";

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    CreateProductController,
    GetProductController,
    UpdateProductController,
    DeleteProductController,
    SearchProductController,
    GetProductsByOrganizationController,
    GetPublicProductsController,
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
  ],
  exports: [],
})
export class ProductModule {}
