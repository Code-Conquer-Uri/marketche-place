import type { ServiceError } from "@/core/errors/service-error";

export class TokenAlreadyUsedError extends Error implements ServiceError {
  constructor() {
    super("Token has already been used");
  }
}
