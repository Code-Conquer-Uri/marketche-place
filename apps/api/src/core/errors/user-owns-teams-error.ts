import type { ServiceError } from "@/core/errors/service-error";

export class UserOwnsTeamsError extends Error implements ServiceError {
  constructor(public readonly teamNames: string[]) {
    super(
      `Usuário não pode ser deletado pois é responsável pelos seguintes grupos: ${teamNames.join(", ")}`,
    );
  }
}
