import { Module } from "@nestjs/common";
import { EnvModule } from "../env/env.module";
import { EventEmitterBridge } from "./event-emitter.bridge";
import { MailerService } from "./mailer/mailer.service";
import { SendInviteEmailListener } from "./user/listeners/send-invite-email.listener";
import { SendResetPasswordEmailListener } from "./user/listeners/send-reset-password-email.listener";
import { SendVerificationEmailListener } from "./user/listeners/send-verification-email.listener";

@Module({
  imports: [EnvModule],
  controllers: [],
  providers: [
    MailerService,
    EventEmitterBridge,
    SendVerificationEmailListener,
    SendResetPasswordEmailListener,
    SendInviteEmailListener,
  ],
  exports: [],
})
export class EventsModule {}
