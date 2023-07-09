import React from 'react';
import { useAppData } from 'providers/DataProvider';
import { Workspace } from 'components/Workspace';
import { NoteListContainer } from 'containers/NoteListContainer';
import { NoteContainer } from 'containers/NoteContainer';

export const HomeConnected: React.FC = () => {
  const { currentNoteId, currentNote } = useAppData();

  return (
    <Workspace>
      <NoteListContainer />
      <NoteContainer key={currentNoteId} defaultText={currentNote?.text ?? ''} />
    </Workspace>
  );
};
