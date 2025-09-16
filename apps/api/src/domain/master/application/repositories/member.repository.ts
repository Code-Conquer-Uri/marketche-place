import type { Member } from "../../enterprise/entities/member";

export abstract class MemberRepository {
  abstract create(member: Member): Promise<void>;

  abstract findById(id: string): Promise<Member | null>;

  abstract findByOrganizationId(organizationId: string): Promise<Member[]>;

  abstract findByUserId(userId: string): Promise<Member[]>;

  abstract findByUserIdAndOrganizationId(
    userId: string,
    organizationId: string,
  ): Promise<Member | null>;

  abstract findAll(): Promise<Member[]>;

  abstract findManyByIds(ids: string[]): Promise<Member[]>;

  abstract findManyByUserIds(userIds: string[]): Promise<Member[]>;

  abstract findManyByOrganizationIds(
    organizationIds: string[],
  ): Promise<Member[]>;

  abstract findManyByUserIdsAndOrganizationIds(
    userIds: string[],
    organizationIds: string[],
  ): Promise<Member[]>;

  abstract save(member: Member): Promise<void>;

  abstract delete(member: Member): Promise<void>;
}
