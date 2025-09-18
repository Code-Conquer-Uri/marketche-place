import { Module } from "@nestjs/common";

import { DatabaseModule } from "@/infra/database/database.module";
import { GetOrganizationBySlugController } from "@/infra/http/organization/get-organization-by-slug.controller";

import { GetOrganizationBySlugService } from "../../../domain/master/application/service/organization/get-organization-by-slug.service";

@Module({
  imports: [DatabaseModule],
  controllers: [GetOrganizationBySlugController],
  providers: [GetOrganizationBySlugService],
  exports: [],
})
export class OrganizationModule {}
