import { Repository } from "@/core/repositories/repository";
import type { User } from "../../enterprise/entities/user";

export type UserPaginationParams = {
  page: number;
  perPage: number;

  orderBy?: "createdAt" | "updatedAt" | "name" | "email";
  orderDirection?: "asc" | "desc";

  search?: string;
};

export abstract class UserRepository extends Repository<User> {
  abstract findByEmail(email: string): Promise<User | null>;

  abstract findPaginated(params: UserPaginationParams): Promise<{
    users: User[];
    total: number;
    pages: number;
  }>;
}
