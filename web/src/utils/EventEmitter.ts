export type EventCallback<Payload, Options> = (
  payload: Payload,
  options?: Options,
) => void;

export type UnsubscribeFn = () => void;

export class EventEmitter<Options = void, Event extends string = string, Payload = {}> {
  private events: Record<string, Array<EventCallback<Payload, Options>>> = {};

  emit(
    eventId: Event,
    payload?: Payload,
    options?: Options,
  ) {
    if (eventId in this.events) {
      const callbacks: Array<EventCallback<any, Options>> = this.events[eventId];
      callbacks.forEach((callback) => callback(payload, options));
    }
  }

  on(
    eventId: Event,
    callback: EventCallback<Payload, Options>,
  ): UnsubscribeFn {
    if (!(eventId in this.events)) {
      this.events[eventId] = [];
    }
    this.events[eventId].push(callback);

    return () => this.off(eventId, callback);
  }

  off(eventId: Event, callback: EventCallback<Payload, Options>) {
    const callbacks: Array<EventCallback<Payload, Options>> = this.events[eventId] ?? [];
    this.events[eventId] = callbacks.filter(cb => cb !== callback);
  }

  destroy() {
    Object.values(this.events).forEach((callbacks) => {
      callbacks = [];
    });
  }
}
