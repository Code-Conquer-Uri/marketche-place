import type { ServiceError } from "@/core/errors/service-error";

export class ResourceNotFoundError extends Error implements ServiceError {
  constructor() {
    super("Recurso não encontrado");
  }
}
