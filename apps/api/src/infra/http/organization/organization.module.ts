import { Module } from "@nestjs/common";

import { DatabaseModule } from "@/infra/database/database.module";
import { GetOrganizationBySlugController } from "@/infra/http/organization/get-organization-by-slug.controller";
import { SearchOrganizationsController } from "@/infra/http/organization/search-organizations.controller";

import { GetOrganizationBySlugService } from "../../../domain/master/application/service/organization/get-organization-by-slug.service";
import { SearchOrganizationsService } from "../../../domain/master/application/service/organization/search-organizations.service";

@Module({
  imports: [DatabaseModule],
  controllers: [GetOrganizationBySlugController, SearchOrganizationsController],
  providers: [GetOrganizationBySlugService, SearchOrganizationsService],
  exports: [],
})
export class OrganizationModule {}
