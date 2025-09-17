import type {
  UserPaginationParams,
  UserRepository,
} from "@/domain/master/application/repositories/user.repository";
import type { User } from "@/domain/master/enterprise/entities/user";

export class InMemoryUserRepository implements UserRepository {
  public users: User[] = [];

  async create(user: User): Promise<void> {
    this.users.push(user);
  }

  async findById(id: string): Promise<User | null> {
    const user = this.users.find((user) => user.id.toString() === id);
    if (!user) {
      return null;
    }

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = this.users.find((user) => user.email === email);
    if (!user) {
      return null;
    }

    return user;
  }

  async findManyByIds(ids: string[]): Promise<User[]> {
    return this.users.filter((user) => ids.includes(user.id.toString()));
  }

  async findAll(): Promise<User[]> {
    return this.users;
  }

  async findPaginated({
    page,
    perPage,
    orderBy,
    orderDirection,
    search,
  }: UserPaginationParams): Promise<{
    users: User[];
    total: number;
    pages: number;
  }> {
    let filteredUsers = this.users;

    if (search) {
      filteredUsers = filteredUsers.filter((user) =>
        user.name.toLowerCase().includes(search.toLowerCase()),
      );
    }

    if (orderBy) {
      filteredUsers.sort((a, b) => {
        if (orderDirection === "asc") {
          return a[orderBy].toString().localeCompare(b[orderBy].toString());
        } else {
          return b[orderBy]
            .toLocaleString()
            .localeCompare(a[orderBy].toString());
        }
      });
    }

    const total = filteredUsers.length;
    const pages = Math.ceil(total / perPage);

    const start = (page - 1) * perPage;
    const end = start + perPage;
    const paginatedUsers = filteredUsers.slice(start, end);

    return {
      users: paginatedUsers,
      total,
      pages,
    };
  }

  async save(user: User): Promise<void> {
    const userIndex = this.users.findIndex((u) => u.id === user.id);
    if (userIndex !== -1) {
      this.users[userIndex] = user;
    } else {
      throw new Error("User not found");
    }
  }

  async delete(user: User): Promise<void> {
    const userIndex = this.users.findIndex((u) => u.id === user.id);
    if (userIndex !== -1) {
      this.users.splice(userIndex, 1);
    } else {
      throw new Error("User not found");
    }
  }
}
