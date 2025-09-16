import { Injectable, type OnModuleInit } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { setEventEmitter } from "./event-bus";

@Injectable()
export class EventEmitterBridge implements OnModuleInit {
	constructor(private readonly emitter: EventEmitter2) {}

	onModuleInit() {
		setEventEmitter(this.emitter);
	}
}
