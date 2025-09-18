import { PassThrough, Writable } from "node:stream";

import {
  CompleteMultipartUploadCommandOutput,
  DeleteObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  PutObjectCommandOutput,
  S3Client,
} from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Injectable, Logger } from "@nestjs/common";

import {
  StorageFile,
  StorageProvider,
} from "@/domain/master/application/providers/storage.provider";

import { EnvService } from "../env/env.service";

@Injectable()
export class R2StorageProvider implements StorageProvider {
  private readonly logger = new Logger(R2StorageProvider.name);

  private readonly bucket: string;
  private readonly publicBucket: string;
  private readonly client: S3Client;
  private readonly secondsToUrlExpiration: number = 60 * 60; // 1 hour

  constructor(private envService: EnvService) {
    const accountId = this.envService.get("CLOUDFLARE_ACCOUNT_ID");

    this.client = new S3Client({
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      region: "auto",
      credentials: {
        accessKeyId: this.envService.get("AWS_ACCESS_KEY_ID"),
        secretAccessKey: this.envService.get("AWS_SECRET_ACCESS_KEY"),
      },
      forcePathStyle: true,
    });
    this.bucket = this.envService.get("AWS_BUCKET_NAME");

    this.publicBucket = this.envService.get("AWS_PUBLIC_BUCKET_NAME");
  }

  private generateFileKey({
    fileType,
    folder,
    id,
    fileName,
  }: Omit<StorageFile, "fileSize">): string {
    const sanitizedName = fileName
      .replace(/[^a-zA-Z0-9.-]/g, "_")
      .replace(/_+/g, "_");

    return `${folder}/${fileType.split("/")[0]}/${id}-${sanitizedName}`;
  }

  async verifyFile(
    file: StorageFile,
  ): Promise<{ success: boolean; downloadUrl: string }> {
    const fileKey = this.generateFileKey(file);

    try {
      const headCommand = new HeadObjectCommand({
        Bucket: this.bucket,
        Key: fileKey,
      });

      const response = await this.client.send(headCommand);

      if (response.$metadata.httpStatusCode === 200) {
        const downloadUrl = `https://${this.publicBucket}.r2.dev/${fileKey}`;

        return {
          success: true,
          downloadUrl,
        };
      }

      return {
        success: false,
        downloadUrl: "",
      };
    } catch (error) {
      this.logger.error("Error verifying file", error);

      return {
        success: false,
        downloadUrl: "",
      };
    }
  }

  async getSignedUploadUrl(
    file: StorageFile,
  ): Promise<{ uploadUrl: string; uploadId: string }> {
    const fileKey = this.generateFileKey(file);
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: fileKey,
    });

    try {
      const url = await getSignedUrl(this.client, command, {
        expiresIn: this.secondsToUrlExpiration,
      });

      return {
        uploadUrl: url,
        uploadId: fileKey,
      };
    } catch (error) {
      this.logger.error("Error generating signed URL", error);

      throw new Error("Erro ao gerar URL assinada");
    }
  }

  async deleteFile(
    file: StorageFile,
  ): Promise<{ success: boolean; message: string }> {
    const fileKey = this.generateFileKey(file);
    const params = {
      Bucket: this.bucket,
      Key: fileKey,
    };

    try {
      const command = new DeleteObjectCommand(params);

      const response = await this.client.send(command);
      if (response.$metadata.httpStatusCode === 204) {
        return {
          success: true,
          message: "Arquivo deletado com sucesso",
        };
      }

      return {
        success: false,
        message: "Erro ao deletar arquivo",
      };
    } catch (error) {
      return {
        success: false,
        message: "Erro ao deletar arquivo" + JSON.stringify(error),
      };
    }
  }

  async getUploadStream(file: Omit<StorageFile, "fileSize">): Promise<{
    stream: Writable;
    uploadId: string;
    uploadUrl: string;
    downloadUrl: string;
    done: Promise<
      CompleteMultipartUploadCommandOutput | PutObjectCommandOutput
    >;
  }> {
    const fileKey = this.generateFileKey(file);
    const passThrough = new PassThrough();

    const upload = new Upload({
      client: this.client,
      params: {
        Bucket: this.bucket,
        Key: fileKey,
        Body: passThrough,
        ContentType: file.fileType,
      },
    });

    const donePromise = upload.done();

    donePromise.then(
      () => this.logger.log(`Upload completed: ${fileKey}`),
      (err) => {
        passThrough.emit("error", err);
        this.logger.error(`Upload failed: ${fileKey}`, err);
      },
    );

    // Construct the public URL using your publicBucket env var
    const uploadUrl = `https://${this.publicBucket}/${fileKey}`;
    const downloadUrl = `https://${this.publicBucket}.r2.dev/${fileKey}`;

    return {
      stream: passThrough,
      uploadId: fileKey,
      uploadUrl,
      downloadUrl,
      done: donePromise,
    };
  }

  async getFileSize(file: Omit<StorageFile, "fileSize">): Promise<number> {
    const fileKey = this.generateFileKey(file);

    try {
      const headCommand = new HeadObjectCommand({
        Bucket: this.bucket,
        Key: fileKey,
      });

      const response = await this.client.send(headCommand);

      if (response.$metadata.httpStatusCode === 200) {
        return response.ContentLength || 0;
      }

      throw new Error("Failed to retrieve file size");
    } catch (error) {
      this.logger.error("Error getting file size", error);
      throw new Error("Erro ao obter tamanho do arquivo");
    }
  }
}
