import type { ServiceError } from "./service-error";

export class MaxPeopleExceededError extends Error implements ServiceError {
  constructor(category: string, maxPeople: number) {
    super(
      `Número máximo de pessoas excedido para a categoria ${category}. Máximo permitido: ${maxPeople}`,
    );
  }
}
