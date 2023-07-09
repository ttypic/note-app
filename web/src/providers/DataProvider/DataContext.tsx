import React from 'react';
import { noop } from 'utils/noop';
import { ConnectionStatus, LocalNoteChange, Note } from './DataContext.types';

export interface DataContextProps {
  /**
   * User's notes
   */
  notes: Note[];
  /**
   * Shared with user notes
   */
  sharedNotes: Note[];
  /**
   * Connection to the server status
   */
  connectionStatus: ConnectionStatus;
  /**
   * Selected note
   */
  currentNoteId: string;
  /**
   * User ID
   */
  userId: number;
  /**
   * Username
   */
  username: string;
  /**
   * JWT access token
   */
  accessToken: string;
  /**
   * Fire local note change event
   */
  emitNoteChange(change: LocalNoteChange): void;

  /**
   * Select note
   */
  selectNote(noteId: string): void;

  /**
   * Create note
   */
  createNote(): void;

  /**
   * Logout
   */
  logout(): void;
}

//onExternalNoteChange: (nextText: string, change: ExternalNoteChange) => void;

export const DataContext = React.createContext<DataContextProps>({

  notes: [],

  sharedNotes: [],

  connectionStatus: ConnectionStatus.idle,

  emitNoteChange: noop,

  selectNote: noop,

  createNote: noop,

  logout: noop,

  currentNoteId: '',

  userId: 0,

  username: '',

  accessToken: '',

});
