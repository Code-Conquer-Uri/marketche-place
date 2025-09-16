import type { ServiceError } from "@/core/errors/service-error";

export class TokenExpiredError extends Error implements ServiceError {
  constructor() {
    super("Token has expired");
  }
}
