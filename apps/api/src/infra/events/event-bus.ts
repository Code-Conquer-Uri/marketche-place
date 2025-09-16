import type { EventEmitter2 } from "@nestjs/event-emitter";

type QueuedEvent = { name: string; payload: unknown };

let emitterRef: EventEmitter2 | null = null;
const queue: QueuedEvent[] = [];

export function setEventEmitter(emitter: EventEmitter2) {
  emitterRef = emitter;
  // Flush queued events
  while (queue.length) {
    const next = queue.shift();
    if (!next) break;
    emitterRef.emit(next.name, next.payload);
  }
}

export function emitEvent<T = unknown>(name: string, payload: T) {
  if (!emitterRef) {
    queue.push({ name, payload });
    return;
  }
  emitterRef.emit(name, payload);
}

export function getEventEmitter(): EventEmitter2 | null {
  return emitterRef;
}

export function isEventEmitterReady() {
  return emitterRef !== null;
}
