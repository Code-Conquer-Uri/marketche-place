import type { ServiceError } from "./service-error";

export class TermsMustBeAcceptedError extends Error implements ServiceError {
  constructor() {
    super("Os termos devem ser aceitos");
  }
}
