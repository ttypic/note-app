import React, { useMemo, useState } from 'react';
import { noop } from 'utils/noop';
import { DataContext, DataContextProps } from './DataContext';
import { ConnectionStatus, Note } from './DataContext.types';

export interface DataProviderProps {
  accessToken: string;
  children?: React.ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ accessToken, children }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [sharedNotes, setSharedNotes] = useState<Note[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>(ConnectionStatus.idle);
  const [currentNoteId, setCurrentNoteId] = useState('');
  const [userId, setUserId] = useState(0);
  const [username, setUsername] = useState('');


  const value: DataContextProps = useMemo(() => {
    return {
      accessToken,
      notes,
      sharedNotes,
      connectionStatus,
      currentNoteId,
      userId,
      username,
      emitNoteChange: noop,
      selectNote: setCurrentNoteId,
      createNote: noop,
    };
  }, [
    accessToken,
    notes,
    sharedNotes,
    connectionStatus,
    currentNoteId,
    userId,
    username,
  ]);

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
