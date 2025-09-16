import type { ServiceError } from "@/core/errors/service-error";

export class EntityAlreadyExists extends Error implements ServiceError {
  constructor() {
    super("Entity already exists");
  }
}
