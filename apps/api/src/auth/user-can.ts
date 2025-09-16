import { PrismaClient } from "@prisma/client";
import { createAuthClient } from "better-auth/client";
import { adminClient, organizationClient } from "better-auth/client/plugins";

import { accessControl, type auth } from ".";
import type { statements } from "./permissions";

export type Statements = typeof statements;

export type Roles = Parameters<
  typeof auth.api.userHasPermission
>["0"]["body"]["role"];

type UserCanParms =
  | { role: Roles; userId?: never; organizationId?: string }
  | { role?: never; userId: string; organizationId?: string };

export async function userCan<T extends keyof Statements>(
  action: Statements[T][number],
  resource: T,
  { userId, role, organizationId }: UserCanParms,
): Promise<{ error: Error | null; success: boolean }> {
  const authClient = createAuthClient({
    plugins: [
      organizationClient({
        ...accessControl,
      }),
      adminClient({
        ...accessControl,
      }),
    ],
  });

  // If role is provided, check permission directly without looking the db
  if (role) {
    const userHasPermission = authClient.organization.checkRolePermission({
      role,
      permissions: { [resource]: [action] },
    });

    if (!userHasPermission) {
      return {
        error: new Error("User does not have permission"),
        success: false,
      };
    }

    return {
      error: null,
      success: true,
    };
  }

  const prisma = new PrismaClient();

  const member = await prisma.member.findFirst({
    where: {
      userId,
      organizationId,
    },
  });

  if (!member) {
    return {
      error: new Error("User is not a member of the organization"),
      success: false,
    };
  }

  type Role = Parameters<
    typeof authClient.organization.checkRolePermission
  >["0"]["role"];

  const userHasPermission = authClient.organization.checkRolePermission({
    role: member.role as Role,
    permissions: { [resource]: action },
  });

  if (!userHasPermission) {
    return {
      error: new Error("User does not have permission"),
      success: false,
    };
  }

  return {
    error: null,
    success: true,
  };
}
