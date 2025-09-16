import { Module } from "@nestjs/common";

import { PermissionFactory } from "@/domain/master/application/permissions/permission-factory";
import { SearchUserService } from "@/domain/master/application/service/user/search-user.service";

import { CryptographyModule } from "../../cryptography/cryptography.module";
import { DatabaseModule } from "../../database/database.module";
import { SearchUserController } from "./search-user.controller";

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [SearchUserController],
  providers: [PermissionFactory, SearchUserService],
  exports: [],
})
export class UserModule {}
