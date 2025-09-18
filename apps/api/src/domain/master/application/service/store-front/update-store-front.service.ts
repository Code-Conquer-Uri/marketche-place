import { Injectable } from "@nestjs/common";

import { type Either, left, right } from "@/core/either";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { StoreFront } from "@/domain/master/enterprise/entities/store-front";
import { processProductImage } from "@/utils/image-processing";

import { PermissionFactory } from "../../permissions/permission-factory";
import { StorageProvider } from "../../providers/storage.provider";
import { StoreFrontRepository } from "../../repositories/store-front.repository";

interface UpdateStoreFrontServiceRequest {
  userId: string;
  organizationId: string;

  logoImage?: Buffer;
  bannerImage?: Buffer;
  whatsappNumber?: string;
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
    private storageProvider: StorageProvider,
  ) {}

  async execute({
    userId,
    organizationId,
    logoImage,
    bannerImage,
    whatsappNumber,
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
      // Process logo image
      const {
        webpBuffer: logoWebpBuffer,
        blurDataUrl: logoBlurDataUrl,
        mimeType: logoMimeType,
      } = await processProductImage(logoImage, { quality: 85 });

      const logoFileName = `${Date.now()}-logo.webp`;
      const logoFileKey = new UniqueEntityID().toString();

      const logoUploadStream = await this.storageProvider.getUploadStream({
        id: logoFileKey,
        fileName: logoFileName,
        fileType: logoMimeType,
        folder: "storefronts",
      });
      logoUploadStream.stream.end(logoWebpBuffer);
      await new Promise((resolve, reject) => {
        logoUploadStream.stream.on("finish", resolve);
        logoUploadStream.stream.on("error", reject);
      });

      // Wait for upload to complete
      await logoUploadStream.done;

      storeFront.logoImageUrl = logoUploadStream.downloadUrl;
      storeFront.logoImageBlurData = logoBlurDataUrl;
    }

    if (bannerImage !== undefined) {
      // Process banner image
      const {
        webpBuffer: bannerWebpBuffer,
        blurDataUrl: bannerBlurDataUrl,
        mimeType: bannerMimeType,
      } = await processProductImage(bannerImage, { quality: 85 });

      const bannerFileName = `${Date.now()}-banner.webp`;
      const bannerFileKey = new UniqueEntityID().toString();

      const bannerUploadStream = await this.storageProvider.getUploadStream({
        id: bannerFileKey,
        fileName: bannerFileName,
        fileType: bannerMimeType,
        folder: "storefronts",
      });
      bannerUploadStream.stream.end(bannerWebpBuffer);
      await new Promise((resolve, reject) => {
        bannerUploadStream.stream.on("finish", resolve);
        bannerUploadStream.stream.on("error", reject);
      });

      // Wait for upload to complete
      await bannerUploadStream.done;

      storeFront.bannerImageUrl = bannerUploadStream.downloadUrl;
      storeFront.bannerImageBlurData = bannerBlurDataUrl;
    }

    if (whatsappNumber !== undefined) {
      storeFront.whatsappNumber = whatsappNumber;
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
