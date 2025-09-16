import {
  ac,
  generalAdmin,
  organizationAdmin,
  organizationMember,
  organizationOwner,
  user,
} from "@repo/api";
import { env } from "@repo/env";
import { adminClient, organizationClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

const accessControl = {
  ac,
  roles: {
    generalAdmin,
    user,
    organizationOwner,
    organizationAdmin,
    organizationMember,
  },
};

export const authClient = createAuthClient({
  baseURL: env.API_URL,
  plugins: [
    organizationClient({
      ...accessControl,
    }),
    adminClient({
      ...accessControl,
    }),
  ],
  fetchOptions: {
    next: { tags: ["auth"], revalidate: 20 }, // Revalidate every 20 seconds
  },
});
