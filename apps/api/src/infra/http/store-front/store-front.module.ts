import { Module } from "@nestjs/common";

import { PermissionFactory } from "@/domain/master/application/permissions/permission-factory";
import { CreateStoreFrontService } from "@/domain/master/application/service/store-front/create-store-front.service";
import { GetStoreFrontService } from "@/domain/master/application/service/store-front/get-store-front.service";
import { UpdateStoreFrontService } from "@/domain/master/application/service/store-front/update-store-front.service";

import { CryptographyModule } from "../../cryptography/cryptography.module";
import { DatabaseModule } from "../../database/database.module";
import { StorageModule } from "../../storage/storage.module";
import { CreateStoreFrontController } from "./create-store-front.controller";
import { GetStoreFrontController } from "./get-store-front.controller";
import { UpdateStoreFrontController } from "./update-store-front.controller";

@Module({
  imports: [DatabaseModule, CryptographyModule, StorageModule],
  controllers: [
    CreateStoreFrontController,
    UpdateStoreFrontController,
    GetStoreFrontController,
  ],
  providers: [
    PermissionFactory,
    CreateStoreFrontService,
    UpdateStoreFrontService,
    GetStoreFrontService,
  ],
  exports: [],
})
export class StoreFrontModule {}
