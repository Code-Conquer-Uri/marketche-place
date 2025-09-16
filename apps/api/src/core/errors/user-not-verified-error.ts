import type { ServiceError } from "@/core/errors/service-error";

export class UserNotVerifiedError extends Error implements ServiceError {
  constructor() {
    super("Email do usuário não foi verificado");
  }
}
