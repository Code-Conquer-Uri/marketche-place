import { createAccessControl } from "better-auth/plugins/access";
import {
  adminAc,
  defaultStatements as defaultAdminStatements,
  userAc,
} from "better-auth/plugins/admin/access";
import {
  defaultStatements as defaultOrganizationStatements,
  adminAc as organizationAdminAc,
} from "better-auth/plugins/organization/access";

export const statements = {
  ...defaultAdminStatements,
  ...defaultOrganizationStatements,
  organization: ["create", "update", "delete", "transfer-ownership"],
  storeFront: ["create", "update"],
  product: ["create", "update", "delete"],
  coupon: ["create", "update", "delete", "validate"],
} as const;

export const ac = createAccessControl(statements);

export const generalAdmin = ac.newRole({
  ...adminAc.statements,
  ...organizationAdminAc.statements,
  organization: ["create", "update", "delete", "transfer-ownership"],
  storeFront: ["create", "update"],
  product: ["create", "update", "delete"],
  coupon: ["create", "update", "delete", "validate"],
});

export const organizationOwner = ac.newRole({
  ...organizationAdminAc.statements,
  organization: ["create", "update", "delete", "transfer-ownership"],
  storeFront: ["create", "update"],
  product: ["create", "update", "delete"],
  coupon: ["create", "update", "delete", "validate"],
});

export const organizationMember = ac.newRole({
  ...userAc.statements,
  coupon: ["validate"],
});

export const user = ac.newRole({
  ...userAc.statements,
});
