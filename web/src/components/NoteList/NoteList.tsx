import React, { useCallback } from 'react';
import { Note } from 'providers/DataProvider';
import { NoteShareButton } from 'containers/NoteShareButton';
import { NoteRow, NoteRowShare, NoteRowTitle } from './NoteList.styled';

interface NoteListProps {
  notes: Note[];

  accessToken: string;
  currentNoteId: string;
  owned?: boolean;

  onSelect(noteId: string): void;
}

interface NoteComponentProps {
  note: Note;

  selected: boolean;
  owned?: boolean;
  accessToken: string;
  onShare?: (noteId: string) => void;

  onSelect(noteId: string): void;
}

const NoteComponent: React.FC<NoteComponentProps> = ({ note, selected, accessToken, onSelect, owned }) => {
  const title = note.text.trimStart().split('\n')[0] ?? '';

  const handleRowClick = useCallback(() => {
    onSelect(note.id);
  }, [note, onSelect]);

  return (
    <NoteRow selected={selected} onClick={handleRowClick}>
      <NoteRowTitle $untitled={!title}>{title || 'Untitled'}</NoteRowTitle>
      {owned && selected && (
        <NoteRowShare>
          <NoteShareButton noteId={note.id} accessToken={accessToken} />
        </NoteRowShare>
      )}
    </NoteRow>
  );
};


export const NoteList: React.FC<NoteListProps> = ({ notes, accessToken, currentNoteId, owned, onSelect }) => {
  // noinspection TypeScriptValidateTypes
  return (
    <div>
      {notes.map(note =>
        <NoteComponent
          key={note.id}
          accessToken={accessToken}
          note={note}
          owned={owned}
          selected={note.id === currentNoteId}
          onSelect={onSelect} />)}
    </div>
  );
};
