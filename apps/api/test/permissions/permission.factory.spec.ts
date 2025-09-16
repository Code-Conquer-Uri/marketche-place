import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { PermissionFactory } from "@/domain/master/application/permissions/permission-factory";
import { makeMember } from "@/test/factories/make-member";
import { makeUser } from "@/test/factories/make-user";
import { InMemoryMemberRepository } from "@/test/repositories/in-memory-member.repository";

import { InMemoryUserRepository } from "../repositories/in-memory-user.repository";

let inMemoryUserRepository: InMemoryUserRepository;
let inMemoryMemberRepository: InMemoryMemberRepository;
let sut: PermissionFactory;

describe("Permission Factory", () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository();
    inMemoryMemberRepository = new InMemoryMemberRepository();

    sut = new PermissionFactory(
      inMemoryUserRepository,
      inMemoryMemberRepository,
    );
  });

  it("should return error when userId is not provided", async () => {
    const result = await sut.userCan("create", "organization", {
      userId: undefined,
      organizationId: "org-id",
    });

    expect(result.success).toBe(false);
    expect(result.error?.message).toBe("User ID is required");
  });

  it("should return error when user is not found", async () => {
    const result = await sut.userCan("create", "organization", {
      userId: "non-existent-user",
      organizationId: "org-id",
    });

    expect(result.success).toBe(false);
    expect(result.error?.message).toBe("User not found");
  });

  it("should return error when user has no role", async () => {
    const user = makeUser({ role: undefined });
    await inMemoryUserRepository.create(user);

    const result = await sut.userCan("create", "organization", {
      userId: user.id.toString(),
      organizationId: "org-id",
    });

    expect(result.success).toBe(false);
    expect(result.error?.message).toBe("User role not found");
  });

  it("should allow general admin to create organizations globally", async () => {
    const user = makeUser({ role: "generalAdmin" });
    await inMemoryUserRepository.create(user);

    const result = await sut.userCan("create", "organization", {
      userId: user.id.toString(),
      organizationId: undefined,
    });

    expect(result.success).toBe(true);
    expect(result.error).toBeNull();
  });

  it("should allow general admin to do anything in any organization", async () => {
    const user = makeUser({ role: "generalAdmin" });
    await inMemoryUserRepository.create(user);

    const result = await sut.userCan("delete", "organization", {
      userId: user.id.toString(),
      organizationId: "org-id",
    });

    expect(result.success).toBe(true);
    expect(result.error).toBeNull();
  });

  it("should return error when regular user tries to create organization without permission", async () => {
    const user = makeUser({ role: "user" });
    await inMemoryUserRepository.create(user);

    const result = await sut.userCan("create", "organization", {
      userId: user.id.toString(),
      organizationId: undefined,
    });

    expect(result.success).toBe(false);
    expect(result.error?.message).toBe("User does not have permission");
  });

  it("should not allow general user that is not in a organization to do anything in any organization", async () => {
    const user = makeUser({ role: "user" });
    await inMemoryUserRepository.create(user);

    const result = await sut.userCan("delete", "organization", {
      userId: user.id.toString(),
      organizationId: "org-id",
    });

    expect(result.success).toBe(false);
    expect(result.error?.message).toBe(
      "User is not a member of the organization",
    );
  });

  it("should return error when user is not a member of the organization", async () => {
    const user = makeUser({ role: "user" });
    await inMemoryUserRepository.create(user);

    const result = await sut.userCan("update", "organization", {
      userId: user.id.toString(),
      organizationId: "org-id",
    });

    expect(result.success).toBe(false);
    expect(result.error?.message).toBe(
      "User is not a member of the organization",
    );
  });

  it("should return error when member has no role", async () => {
    const user = makeUser({ role: "user" });
    const member = makeMember({
      userId: user.id,
      role: undefined,
      organizationId: new UniqueEntityID("org-id"),
    });

    await inMemoryUserRepository.create(user);
    await inMemoryMemberRepository.create(member);

    const result = await sut.userCan("update", "organization", {
      userId: user.id.toString(),
      organizationId: "org-id",
    });

    expect(result.success).toBe(false);
    expect(result.error?.message).toBe("Member role not found");
  });

  it("should allow organization owner to transfer ownership", async () => {
    const user = makeUser({ role: "user" });
    const member = makeMember({
      userId: user.id,
      organizationId: new UniqueEntityID("org-id"),
      role: "organizationOwner",
    });

    await inMemoryUserRepository.create(user);
    await inMemoryMemberRepository.create(member);

    const result = await sut.userCan("transfer-ownership", "organization", {
      userId: user.id.toString(),
      organizationId: "org-id",
    });

    expect(result.error).toBeNull();
    expect(result.success).toBe(true);
  });

  it("should allow organization admin to update but not delete organization", async () => {
    const user = makeUser({ role: "USER" });
    const member = makeMember({
      userId: user.id,
      organizationId: new UniqueEntityID("org-id"),
      role: "organizationAdmin",
    });

    await inMemoryUserRepository.create(user);
    await inMemoryMemberRepository.create(member);

    const updateResult = await sut.userCan("update", "organization", {
      userId: user.id.toString(),
      organizationId: "org-id",
    });

    const deleteResult = await sut.userCan("delete", "organization", {
      userId: user.id.toString(),
      organizationId: "org-id",
    });

    expect(updateResult.success).toBe(true);
    expect(deleteResult.success).toBe(false);
  });

  it("should deny organization member from updating organization", async () => {
    const user = makeUser({ role: "user" });
    const member = makeMember({
      userId: user.id,
      organizationId: new UniqueEntityID("org-id"),
      role: "organizationMember",
    });

    await inMemoryUserRepository.create(user);
    await inMemoryMemberRepository.create(member);

    const result = await sut.userCan("update", "organization", {
      userId: user.id.toString(),
      organizationId: "org-id",
    });

    expect(result.success).toBe(false);
    expect(result.error?.message).toBe("User does not have permission");
  });
});
