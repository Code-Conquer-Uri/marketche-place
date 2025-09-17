// Email event names
export const EMAIL_EVENT = {
  VERIFY_EMAIL: "email.verify",
  RESET_PASSWORD: "email.reset_password",
  INVITE_MEMBER: "email.invite_member",
} as const;

export type VerifyEmailPayload = {
  userId: string;
  email: string;
  token: string;
};

export type ResetPasswordPayload = {
  userId: string;
  email: string;
  token: string;
};

export type InviteMemberPayload = {
  inviterId: string;
  inviteeEmail: string;
  inviteToken: string;
  organizationId?: string;
  role?: string;
  inviterEmail?: string;
  organizationName?: string;
};
