import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { EMAIL_EVENT, type ResetPasswordPayload } from "../email.events";

@Injectable()
export class SendResetPasswordEmailListener {
  @OnEvent(EMAIL_EVENT.RESET_PASSWORD, { async: true })
  async handle(payload: ResetPasswordPayload) {
    console.log(`Handling reset password email for ${payload.email}`);

    const webUrl = process.env.WEB_URL || "http://localhost:3000";

    const resetLink = webUrl
      ? `${webUrl.replace(/\/$/, "")}/auth/reset-password?token=${encodeURIComponent(payload.token)}`
      : payload.token;

    console.log({ resetLink });
  }
}
