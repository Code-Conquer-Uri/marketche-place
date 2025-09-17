import { Module } from "@nestjs/common";

import { StorageProvider } from "@/domain/master/application/providers/storage.provider";

import { EnvModule } from "../env/env.module";
import { R2StorageProvider } from "./r2-storage.provider";

@Module({
  imports: [EnvModule],
  providers: [
    {
      provide: StorageProvider,
      useClass: R2StorageProvider,
    },
  ],
  exports: [StorageProvider],
})
export class StorageModule {}
