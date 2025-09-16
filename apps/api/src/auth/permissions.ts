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
} as const;

export const ac = createAccessControl(statements);

export const generalAdmin = ac.newRole({
  ...adminAc.statements,
  ...organizationAdminAc.statements,
  organization: ["create", "update", "delete", "transfer-ownership"],
});

export const user = ac.newRole({
  ...userAc.statements,
});

export const organizationOwner = ac.newRole({
  ...organizationAdminAc.statements,
  organization: ["update", "delete", "transfer-ownership"],
});

export const organizationAdmin = ac.newRole({
  ...organizationAdminAc.statements,
  organization: ["update"],
});

export const organizationMember = ac.newRole({
  ...userAc.statements,
});
