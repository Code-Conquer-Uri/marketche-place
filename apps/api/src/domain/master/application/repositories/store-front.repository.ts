import { Repository } from "@/core/repositories/repository";
import { StoreFront } from "../../enterprise/entities/store-front";

export abstract class StoreFrontRepository extends Repository<StoreFront> {
  abstract findByOrganizationId(
    organizationId: string,
  ): Promise<StoreFront | null>;
}
