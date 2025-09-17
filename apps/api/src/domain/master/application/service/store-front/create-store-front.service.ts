import { ConflictException, Injectable } from "@nestjs/common";

import { type Either, left, right } from "@/core/either";
import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { StoreFront } from "@/domain/master/enterprise/entities/store-front";

import { PermissionFactory } from "../../permissions/permission-factory";
import { StoreFrontRepository } from "../../repositories/store-front.repository";

interface CreateStoreFrontServiceRequest {
  userId: string;
  organizationId: string;

  logoImage: Buffer;
  bannerImage: Buffer;
  location: string;
  theme: "DEFAULT" | "AMETHYST_HAZE" | "SOLAR_DUSK";
}

type CreateStoreFrontServiceResponse = Either<
  NotAllowedError,
  {
    storeFront: StoreFront;
  }
>;

@Injectable()
export class CreateStoreFrontService {
  constructor(
    private storeFrontRepository: StoreFrontRepository,
    private permissionFactory: PermissionFactory,
  ) {}

  async execute({
    userId,
    organizationId,
    logoImage,
    bannerImage,
    location,
    theme,
  }: CreateStoreFrontServiceRequest): Promise<CreateStoreFrontServiceResponse> {
    const permission = await this.permissionFactory.userCan(
      "create",
      "storeFront",
      {
        userId,
        organizationId,
      },
    );

    if (!permission.success) {
      return left(new NotAllowedError(permission.error?.message));
    }

    const existingStoreFront =
      await this.storeFrontRepository.findByOrganizationId(organizationId);

    if (existingStoreFront) {
      return left(
        new ConflictException(
          "Store front already exists for this organization",
        ),
      );
    }

    const storeFront = StoreFront.create({
      organizationId,
      logoImage,
      bannerImage,
      location,
      theme,
    });

    await this.storeFrontRepository.create(storeFront);

    return right({
      storeFront,
    });
  }
}
