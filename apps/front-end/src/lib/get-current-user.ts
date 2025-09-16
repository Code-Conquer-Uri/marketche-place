"use server";

import type { statements } from "@repo/api";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { authClient } from "./auth-client";

export const getCurrentUser = async () => {
  const { data: session } = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });

  if (!session) {
    redirect("/auth/sign-out");
  }

  return session;
};

export const isImpersonatingAction = async () => {
  const { data: session } = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });

  if (!session) {
    return false;
  }

  const isImpersonated = session?.session?.impersonatedBy;

  if (!isImpersonated) {
    return false;
  }

  return true;
};

export type Statements = typeof statements;

export async function userCan<T extends keyof Statements>(
  action: Statements[T][number],
  resource: T,
  organizationId?: string,
): Promise<boolean> {
  const { user } = await getCurrentUser();

  if (!user.role) {
    return false;
  }

  type Roles = Parameters<
    typeof authClient.organization.checkRolePermission
  >["0"]["role"];

  if (!organizationId) {
    const role = user.role as Roles;
    return authClient.organization.checkRolePermission({
      role,
      permissions: { [resource]: [action] },
    });
  }

  const { data } = await authClient.organization.getActiveMember();

  if (!data) {
    return false;
  }

  const role = data.role as Roles;
  return authClient.organization.checkRolePermission({
    role,
    permissions: { [resource]: [action] },
  });
}
