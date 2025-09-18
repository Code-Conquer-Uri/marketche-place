import { Writable } from "node:stream";

import {
  CompleteMultipartUploadCommandOutput,
  PutObjectCommandOutput,
} from "@aws-sdk/client-s3";

export type StorageFile = {
  id: string;

  fileName: string;
  fileType: string;
  fileSize: number;

  folder: string;
};

export abstract class StorageProvider {
  abstract getSignedUploadUrl(file: StorageFile): Promise<{
    uploadUrl: string;
    uploadId: string;
  }>;

  abstract verifyFile(file: StorageFile): Promise<{
    success: boolean;
    downloadUrl: string;
  }>;

  abstract deleteFile(file: StorageFile): Promise<{
    success: boolean;
    message: string;
  }>;

  abstract getUploadStream(file: Omit<StorageFile, "fileSize">): Promise<{
    stream: Writable;
    uploadId: string;
    uploadUrl: string;
    downloadUrl: string;
    done: Promise<
      CompleteMultipartUploadCommandOutput | PutObjectCommandOutput
    >;
  }>;

  abstract getFileSize(file: Omit<StorageFile, "fileSize">): Promise<number>;
}
