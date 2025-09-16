import { PrismaClient } from "@prisma/client";
import { env } from "@repo/env";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { bearer } from "better-auth/plugins";
import { admin } from "better-auth/plugins/admin";
import { organization } from "better-auth/plugins/organization";
import { emitEvent } from "@/infra/events/event-bus";
import {
  EMAIL_EVENT,
  type ResetPasswordPayload,
} from "@/infra/events/user/email.events";
import {
  ac,
  generalAdmin,
  organizationMember,
  organizationOwner,
  user,
} from "./permissions";

export const accessControl = {
  ac,
  roles: {
    generalAdmin,
    user,
    organizationOwner,
    organizationMember,
  },
};

const prisma = new PrismaClient();

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    async sendResetPassword(data) {
      emitEvent(EMAIL_EVENT.RESET_PASSWORD, {
        email: data.user.email,
        token: data.token,
        userId: data.user.id,
      } satisfies ResetPasswordPayload);
    },
  },

  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // Cache duration in seconds
    },
  },

  socialProviders: {
    ...(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET
      ? {
          google: {
            clientId: env.GOOGLE_CLIENT_ID,
            clientSecret: env.GOOGLE_CLIENT_SECRET,
          },
        }
      : {}),

    ...(env.APPLE_CLIENT_ID && env.APPLE_CLIENT_SECRET
      ? {
          apple: {
            clientId: env.APPLE_CLIENT_ID,
            clientSecret: env.APPLE_CLIENT_SECRET,
            // Optional
            appBundleIdentifier: env.APPLE_APP_BUNDLE_IDENTIFIER,
          },
        }
      : {}),

    ...(env.FACEBOOK_CLIENT_ID && env.FACEBOOK_CLIENT_SECRET
      ? {
          facebook: {
            clientId: env.FACEBOOK_CLIENT_ID,
            clientSecret: env.FACEBOOK_CLIENT_SECRET,
          },
        }
      : {}),
  },
  emailVerification: {
    sendVerificationEmail: async (data) => {
      emitEvent(EMAIL_EVENT.VERIFY_EMAIL, {
        email: data.user.email,
        token: data.token,
        userId: data.user.id,
      });

      await Promise.resolve();
    },
  },

  trustedOrigins: [
    "https://appleid.apple.com",
    "https://www.facebook.com",
    "https://accounts.google.com",
    "http://localhost:3000",
    "https://localhost:3333",
  ],

  plugins: [
    organization({
      ...accessControl,
      creatorRole: "organizationOwner",
      allowUserToCreateOrganization: (user) => {
        const userIsOwner = prisma.member.count({
          where: { userId: user.id, role: "organizationOwner" },
        });

        // Limit the user to create up to 3 organizations

        return userIsOwner.then((count) => count < 3);
      },
      sendInvitationEmail: async (data) => {
        emitEvent(EMAIL_EVENT.INVITE_MEMBER, {
          email: data.email,
          inviteToken: data.invitation.id,
          organizationId: data.organization.name,
          inviterId: data.inviter.user.name,
        });
      },
    }),

    admin({
      ...accessControl,
    }),

    bearer(),
  ],
});
