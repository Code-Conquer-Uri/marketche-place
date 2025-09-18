import { Module } from "@nestjs/common";
import { OrganizationModule } from "@/infra/http/organization/organization.module";
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
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class HttpModule {}
