import { PermissionFactory } from "@/domain/master/application/permissions/permission-factory";
import { SearchUserService } from "@/domain/master/application/service/user/search-user.service";
import { makeUser } from "@/test/factories/make-user";
import { InMemoryMemberRepository } from "@/test/repositories/in-memory-member.repository";
import { InMemoryUserRepository } from "@/test/repositories/in-memory-user.repository";

let inMemoryUserRepository: InMemoryUserRepository;
let inMemoryMemberRepository: InMemoryMemberRepository;
let permissionFactory: PermissionFactory;
let sut: SearchUserService;

describe("SearchUserService", () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository();
    inMemoryMemberRepository = new InMemoryMemberRepository();
    permissionFactory = new PermissionFactory(
      inMemoryUserRepository,
      inMemoryMemberRepository,
    );

    sut = new SearchUserService(inMemoryUserRepository, permissionFactory);
  });

  it("should return error when user does not have permission to list users", async () => {
    const user = makeUser({ role: "user" });
    await inMemoryUserRepository.create(user);

    const result = await sut.execute({
      userId: user.id.toString(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toEqual(
      expect.objectContaining({
        message: expect.any(String),
      }),
    );
  });

  it("should return users when user has permission", async () => {
    const adminUser = makeUser({ role: "generalAdmin" });
    const regularUser = makeUser({
      name: "John Doe",
      email: "john@example.com",
    });

    await inMemoryUserRepository.create(adminUser);
    await inMemoryUserRepository.create(regularUser);

    const result = await sut.execute({
      userId: adminUser.id.toString(),
    });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.users).toHaveLength(2);
      expect(result.value.total).toBe(2);
      expect(result.value.pages).toBe(1);
    }
  });

  it("should filter users by search term", async () => {
    const adminUser = makeUser({ role: "generalAdmin" });
    const user1 = makeUser({ name: "John Doe", email: "john@example.com" });
    const user2 = makeUser({ name: "Jane Smith", email: "jane@example.com" });

    await inMemoryUserRepository.create(adminUser);
    await inMemoryUserRepository.create(user1);
    await inMemoryUserRepository.create(user2);

    const result = await sut.execute({
      userId: adminUser.id.toString(),
      searchTerm: "John",
    });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.users).toHaveLength(1);
      expect(result.value.users[0].name).toBe("John Doe");
    }
  });

  it("should apply pagination correctly", async () => {
    const adminUser = makeUser({ role: "generalAdmin" });
    await inMemoryUserRepository.create(adminUser);

    // Create 5 additional users
    for (let i = 1; i <= 5; i++) {
      const user = makeUser({
        name: `User ${i}`,
        email: `user${i}@example.com`,
      });
      await inMemoryUserRepository.create(user);
    }

    const result = await sut.execute({
      userId: adminUser.id.toString(),
      page: 1,
      perPage: 3,
    });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.users).toHaveLength(3);
      expect(result.value.total).toBe(6);
      expect(result.value.pages).toBe(2);
    }
  });

  it("should apply default pagination when not specified", async () => {
    const adminUser = makeUser({ role: "generalAdmin" });
    await inMemoryUserRepository.create(adminUser);

    const result = await sut.execute({
      userId: adminUser.id.toString(),
    });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.users).toHaveLength(1);
      expect(result.value.total).toBe(1);
      expect(result.value.pages).toBe(1);
    }
  });

  it("should apply ordering when specified", async () => {
    const adminUser = makeUser({ role: "generalAdmin" });
    const user1 = makeUser({ name: "Alice", email: "alice@example.com" });
    const user2 = makeUser({ name: "Bob", email: "bob@example.com" });

    await inMemoryUserRepository.create(adminUser);
    await inMemoryUserRepository.create(user1);
    await inMemoryUserRepository.create(user2);

    const result = await sut.execute({
      userId: adminUser.id.toString(),
      orderBy: "name",
      orderDirection: "asc",
    });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.users[0].name).toBe("Alice");
      expect(result.value.users[1].name).toBe("Bob");
    }
  });
});
