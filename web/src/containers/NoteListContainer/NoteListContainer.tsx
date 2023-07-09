import React from 'react';
import { useAppData } from 'providers/DataProvider';
import { Logo } from 'components/Logo';
import { LogoutIcon, PlusIcon } from 'components/Icon';
import { UnstyledButton } from 'components/Button';
import { Flex, LeftPanel, Spacer } from './NoteListContainer.styled';
import { NoteList } from '../../components/NoteList';

interface NoteListContainerProps {
}

export const NoteListContainer: React.FC<NoteListContainerProps> = () => {
  const { currentNoteId, createNote, logout, notes, sharedNotes, selectNote } = useAppData();

  return (
    <LeftPanel open={!currentNoteId}>
      <Spacer height={16} />
      <Flex>
        <Logo size={32} />
        <UnstyledButton onClick={logout} title='Log out'>
          <LogoutIcon />
        </UnstyledButton>
      </Flex>
      <Spacer height={16} />
      <Flex>
        My Notes
        <UnstyledButton onClick={createNote} title='Add note'>
          <PlusIcon />
        </UnstyledButton>
      </Flex>
      <Spacer height={4} />
      <NoteList notes={notes} currentNoteId={currentNoteId} onSelect={selectNote} />
      <Spacer height={8} />
      <Flex>
        Shared With Me
      </Flex>
      <Spacer height={4} />
      <NoteList notes={sharedNotes} currentNoteId={currentNoteId} onSelect={selectNote} />
    </LeftPanel>
  );
};
