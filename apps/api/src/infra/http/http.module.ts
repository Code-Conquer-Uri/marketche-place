import { Module } from "@nestjs/common";

import { CryptographyModule } from "../cryptography/cryptography.module";
import { DatabaseModule } from "../database/database.module";
import { UserModule } from "./user/user.module";

@Module({
  imports: [DatabaseModule, CryptographyModule, UserModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class HttpModule {}
