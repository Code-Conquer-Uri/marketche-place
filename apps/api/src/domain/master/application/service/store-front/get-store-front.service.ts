import { Injectable } from "@nestjs/common";

import { type Either, left, right } from "@/core/either";
import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { StoreFront } from "@/domain/master/enterprise/entities/store-front";

import { StoreFrontRepository } from "../../repositories/store-front.repository";

interface GetStoreFrontServiceRequest {
  organizationId: string;
}

type GetStoreFrontServiceResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  {
    storeFront: StoreFront;
  }
>;

@Injectable()
export class GetStoreFrontService {
  constructor(private storeFrontRepository: StoreFrontRepository) {}

  async execute({
    organizationId,
  }: GetStoreFrontServiceRequest): Promise<GetStoreFrontServiceResponse> {
    const storeFront =
      await this.storeFrontRepository.findByOrganizationId(organizationId);

    if (!storeFront) {
      return left(new ResourceNotFoundError());
    }

    return right({
      storeFront,
    });
  }
}
