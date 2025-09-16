import type { ServiceError } from "./service-error";

export class PresentationLimitExceededError
  extends Error
  implements ServiceError
{
  constructor() {
    super("Limite de apresentações excedido");
  }
}
