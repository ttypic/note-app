import { Note } from './note.entity';

export interface UserStateResponse {
  userId: number;
  notes: Note[];
  sharedNotes: Note[];
  lastEventTimestamp: Date | null | undefined;
}

export interface NoteShareRequest {
  noteId: string;
  sharedWith: string;
}
