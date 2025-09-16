import type { ServiceError } from "@/core/errors/service-error";

export class NotAllowedError extends Error implements ServiceError {
  constructor(text?: string) {
    super(text || "Not allowed");
  }
}
