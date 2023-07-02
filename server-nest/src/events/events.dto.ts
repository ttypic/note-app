export interface NoteCreatedPayload {
  id: string;
  userId: number;
  noteId: string;
}

export interface NoteUpdatedPayload {
  id: string;
  userId: number;
  noteId: string;
  startSelection: number;
  endSelection: number;
  replacement: string;
}

export interface NoteSharedPayload {
  id: string;
  userId: number;
  noteId: string;
}

export interface EventRejectedPayload {
  id: string;
  userId: number;
  rejectedClientId: string;
}
