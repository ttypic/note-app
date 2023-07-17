import { AppliedEvent, Note } from './note.entity';

export interface UserConnectClientRequest {
  sessionId: string;
  userId: number;
}

export interface NoteShareRequestBody {
  noteId: string;
  sharedWith: string;
}

export interface NoteShareClientRequest {
  userId: number;
  noteId: string;
  sharedWith: string;
}

export interface NoteCreateClientRequest {
  id: string;
  userId: number;
  noteId: string;
}

export interface NoteUpdateClientRequest {
  id: string;
  userId: number;
  noteId: string;
  startSelection: number;
  endSelection: number;
  replacement: string;
  version: number;
}

export interface NoteCreateRequest {
  clientId: string;
  eventId: number;
  userId: number;
  noteId: string;
}

export interface NoteUpdateRequest {
  clientId: string;
  eventId: number;
  userId: number;
  noteId: string;
  startSelection: number;
  endSelection: number;
  replacement: string;
  version: number;
}

export interface UserStateResponse {
  sessionId: string;
  userId: number;
  username: string;
  notes: Note[];
  sharedNotes: Note[];
  lastEventId: number;
}

export interface NoteSharedResponse {
  userId: number;
  note: Note;
}

export interface NoteUpdatedResponse {
  userIds: number[];
  appliedEvent: AppliedEvent;
}
