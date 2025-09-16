import type { ServiceError } from "@/core/errors/service-error";

export class InvalidTokenError extends Error implements ServiceError {
  constructor() {
    super("Invalid token");
  }
}
