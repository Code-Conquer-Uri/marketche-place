import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { EMAIL_EVENT, type VerifyEmailPayload } from "../email.events";

@Injectable()
export class SendVerificationEmailListener {
  @OnEvent(EMAIL_EVENT.VERIFY_EMAIL, { async: true })
  async handle(payload: VerifyEmailPayload) {
    const webUrl =
      process.env.WEB_URL || process.env.APP_URL || process.env.API_URL;
    const verifyLink = webUrl
      ? `${webUrl.replace(/\/$/, "")}/verify-email?token=${encodeURIComponent(payload.token)}`
      : payload.token;

    console.log({
      verifyLink,
    });
  }
}
