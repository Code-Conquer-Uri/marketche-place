import { Repository } from "@/core/repositories/repository";
import type { Member } from "../../enterprise/entities/member";

export abstract class MemberRepository extends Repository<Member> {
  abstract findByOrganizationId(organizationId: string): Promise<Member[]>;

  abstract findByUserId(userId: string): Promise<Member[]>;

  abstract findByUserIdAndOrganizationId(
    userId: string,
    organizationId: string,
  ): Promise<Member | null>;

  abstract findAll(): Promise<Member[]>;

  abstract findManyByUserIds(userIds: string[]): Promise<Member[]>;

  abstract findManyByOrganizationIds(
    organizationIds: string[],
  ): Promise<Member[]>;

  abstract findManyByUserIdsAndOrganizationIds(
    userIds: string[],
    organizationIds: string[],
  ): Promise<Member[]>;
}
