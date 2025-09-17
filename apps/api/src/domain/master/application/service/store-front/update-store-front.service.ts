import { Injectable } from "@nestjs/common";

import { type Either, left, right } from "@/core/either";
import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { StoreFront } from "@/domain/master/enterprise/entities/store-front";

import { PermissionFactory } from "../../permissions/permission-factory";
import { StoreFrontRepository } from "../../repositories/store-front.repository";

interface UpdateStoreFrontServiceRequest {
  userId: string;
  organizationId: string;

  logoImage?: Buffer;
  bannerImage?: Buffer;
  location?: string;
  theme?: "DEFAULT" | "AMETHYST_HAZE" | "SOLAR_DUSK";
}

type UpdateStoreFrontServiceResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  {
    storeFront: StoreFront;
  }
>;

@Injectable()
export class UpdateStoreFrontService {
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
  }: UpdateStoreFrontServiceRequest): Promise<UpdateStoreFrontServiceResponse> {
    const permission = await this.permissionFactory.userCan(
      "update",
      "storeFront",
      {
        userId,
        organizationId,
      },
    );

    if (!permission.success) {
      return left(new NotAllowedError(permission.error?.message));
    }

    const storeFront =
      await this.storeFrontRepository.findByOrganizationId(organizationId);

    if (!storeFront) {
      return left(new ResourceNotFoundError());
    }

    if (logoImage !== undefined) {
      storeFront.logoImage = logoImage;
    }

    if (bannerImage !== undefined) {
      storeFront.bannerImage = bannerImage;
    }

    if (location !== undefined) {
      storeFront.location = location;
    }

    if (theme !== undefined) {
      storeFront.theme = theme;
    }

    await this.storeFrontRepository.save(storeFront);

    return right({
      storeFront,
    });
  }
}
