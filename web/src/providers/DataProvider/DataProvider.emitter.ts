import { EventEmitter } from 'utils/EventEmitter';
import { ExternalNoteChange } from './DataContext.types';

export interface NoteUpdatedPayload {
  nextText: string;
  change: ExternalNoteChange;
}

const noteUpdatedEmitter = new EventEmitter<void, typeof noteUpdatedEventId, NoteUpdatedPayload>();
const noteUpdatedEventId = 'noteUpdated';

export const notifyNoteUpdated = (payload: NoteUpdatedPayload) => {
  noteUpdatedEmitter.emit(noteUpdatedEventId, payload);
};

export const subscribeNoteUpdated = (cb: (payload: NoteUpdatedPayload) => void): (() => void) => {
  noteUpdatedEmitter.on(noteUpdatedEventId, cb);
  return () => {
    noteUpdatedEmitter.off(noteUpdatedEventId, cb);
  };
};
