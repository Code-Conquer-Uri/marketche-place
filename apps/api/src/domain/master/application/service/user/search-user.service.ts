import { Injectable } from "@nestjs/common";

import { type Either, left, right } from "@/core/either";
import { NotAllowedError } from "@/core/errors/not-allowed-error";
import type { User } from "@/domain/master/enterprise/entities/user";

import { PermissionFactory } from "../../permissions/permission-factory";
import { UserRepository } from "../../repositories/user.repository";

interface SearchUserServiceRequest {
  userId: string;

  searchTerm?: string;
  page?: number;
  perPage?: number;

  orderBy?: "createdAt" | "updatedAt" | "name" | "email" | undefined;
  orderDirection?: "asc" | "desc";
}

type SearchUserServiceResponse = Either<
  NotAllowedError,
  {
    users: User[];
    total: number;
    pages: number;
  }
>;

@Injectable()
export class SearchUserService {
  constructor(
    private userRepository: UserRepository,
    private permissionFactory: PermissionFactory,
  ) {}

  async execute({
    userId,
    orderBy,
    orderDirection,
    page,
    perPage,
    searchTerm,
  }: SearchUserServiceRequest): Promise<SearchUserServiceResponse> {
    const permission = await this.permissionFactory.userCan("list", "user", {
      userId,
    });

    if (!permission.success) {
      return left(new NotAllowedError(permission.error?.message));
    }

    const { users, total, pages } = await this.userRepository.findPaginated({
      page: page || 1,
      perPage: perPage || 10,
      orderBy,
      orderDirection,
      search: searchTerm,
    });

    return right({
      users,
      total,
      pages,
    });
  }
}
