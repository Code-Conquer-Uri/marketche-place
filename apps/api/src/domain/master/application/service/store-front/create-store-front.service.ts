import { ConflictException, Injectable } from "@nestjs/common";

import { type Either, left, right } from "@/core/either";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { StoreFront } from "@/domain/master/enterprise/entities/store-front";
import { processProductImage } from "@/utils/image-processing";

import { PermissionFactory } from "../../permissions/permission-factory";
import { StorageProvider } from "../../providers/storage.provider";
import { StoreFrontRepository } from "../../repositories/store-front.repository";

interface CreateStoreFrontServiceRequest {
  userId: string;
  organizationId: string;

  logoImage: Buffer;
  bannerImage: Buffer;
  whatsappNumber?: string;
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

    // Process logo image
    const {
      webpBuffer: logoWebpBuffer,
      blurDataUrl: logoBlurDataUrl,
      mimeType: logoMimeType,
    } = await processProductImage(logoImage, { quality: 85 });

    const logoFileName = `logo.webp`;

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

    const logoImageUrl = logoUploadStream.downloadUrl;

    // Process banner image
    const {
      webpBuffer: bannerWebpBuffer,
      blurDataUrl: bannerBlurDataUrl,
      mimeType: bannerMimeType,
    } = await processProductImage(bannerImage, { quality: 85 });

    const bannerFileName = `banner.webp`;

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

    const bannerImageUrl = bannerUploadStream.downloadUrl;

    const storeFront = StoreFront.create({
      organizationId,
      logoImageUrl: logoImageUrl,
      logoImageBlurData: logoBlurDataUrl,
      bannerImageUrl: bannerImageUrl,
      bannerImageBlurData: bannerBlurDataUrl,
      whatsappNumber,
      location,
      theme,
    });

    await this.storeFrontRepository.create(storeFront);

    return right({
      storeFront,
    });
  }
}
