import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { EMAIL_EVENT, type InviteMemberPayload } from "../email.events";

@Injectable()
export class SendInviteEmailListener {
	@OnEvent(EMAIL_EVENT.INVITE_MEMBER, { async: true })
	async handle(payload: InviteMemberPayload) {
		const webUrl = process.env.WEB_URL || "http://localhost:3000/";
		const acceptLink = webUrl
			? `${webUrl.replace(/\/$/, "")}/auth/accept-invitation?token=${encodeURIComponent(payload.inviteToken)}`
			: payload.inviteToken;

		console.log({ acceptLink });
	}
}
