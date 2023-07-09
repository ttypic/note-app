import React, { useCallback } from 'react';
import { Note } from 'providers/DataProvider';
import { UnstyledButton } from '../Button';
import { ShareIcon } from '../Icon';
import { NoteRow, NoteRowShare, NoteRowTitle } from './NoteList.styled';

interface NoteListProps {
  notes: Note[];

  currentNoteId: string;
  onShare?: (noteId: string) => void;

  onSelect(noteId: string): void;
}

interface NoteComponentProps {
  note: Note;

  selected: boolean;
  onShare?: (noteId: string) => void;

  onSelect(noteId: string): void;
}

const NoteComponent: React.FC<NoteComponentProps> = ({ note, selected, onSelect, onShare }) => {
  const title = note.text.trimStart().split('\n')[0] ?? '';

  const handleRowClick = useCallback(() => {
    onSelect(note.id);
  }, [note, onSelect]);

  const handleShareClick = useCallback(() => {
    onShare?.(note.id);
  }, [note, onShare]);

  return (
    <NoteRow selected={selected} onClick={handleRowClick}>
      <NoteRowTitle $untitled={!title}>{title || 'Untitled'}</NoteRowTitle>
      {onShare && selected && (
        <NoteRowShare>
          <UnstyledButton onClick={handleShareClick} title='Share'>
            <ShareIcon />
          </UnstyledButton>
        </NoteRowShare>
      )}
    </NoteRow>
  );
};


export const NoteList: React.FC<NoteListProps> = ({ notes, currentNoteId, onSelect, onShare }) => {
  // noinspection TypeScriptValidateTypes
  return (
    <div>
      {notes.map(note => <NoteComponent key={note.id} note={note} selected={note.id === currentNoteId}
                                        onSelect={onSelect} onShare={onShare} />)}
    </div>
  );
};
