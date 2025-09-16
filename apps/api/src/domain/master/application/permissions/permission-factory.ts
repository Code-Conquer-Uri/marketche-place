import { Injectable } from "@nestjs/common";

import { type Roles, type Statements, userCan } from "@/auth/user-can";

import { MemberRepository } from "../repositories/member.repository";
import { UserRepository } from "../repositories/user.repository";

type UserCanParams = Parameters<typeof userCan>;

@Injectable()
export class PermissionFactory {
  constructor(
    private userRepository: UserRepository,
    private memberRepository: MemberRepository,
  ) {}

  async userCan<T extends keyof Statements>(
    action: Statements[T][number],
    resource: T,
    { userId, organizationId }: Omit<UserCanParams["2"], "role">,
  ): Promise<{
    error: Error | null;
    success: boolean;
  }> {
    if (!userId) {
      return {
        error: new Error("User ID is required"),
        success: false,
      };
    }
    const user = await this.userRepository.findById(userId);

    if (!user) {
      return {
        error: new Error("User not found"),
        success: false,
      };
    }

    if (!user.role) {
      return {
        error: new Error("User role not found"),
        success: false,
      };
    }

    if (!organizationId) {
      const role = user.role as Roles;
      return userCan<T>(action, resource, { role });
    }

    const userAlreadyHasPermission = await userCan<T>(action, resource, {
      role: user.role as Roles,
    });

    if (userAlreadyHasPermission.success) {
      return userAlreadyHasPermission;
    }

    const member = await this.memberRepository.findByUserIdAndOrganizationId(
      userId,
      organizationId,
    );

    if (!member) {
      return {
        error: new Error("User is not a member of the organization"),
        success: false,
      };
    }

    if (!member.role) {
      return {
        error: new Error("Member role not found"),
        success: false,
      };
    }

    const role = member.role as Roles;

    return userCan<T>(action, resource, { role, organizationId });
  }
}
