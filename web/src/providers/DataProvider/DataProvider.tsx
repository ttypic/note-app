import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import * as uuid from 'uuid';
import { WS_URL } from 'global/urls';
import { DataContext, DataContextProps } from './DataContext';
import { ConnectionStatus, EventType, LocalNoteChange, Note, RequestType } from './DataContext.types';
import { applyOpTransform } from './applyOpTransform';
import { notifyNoteUpdated } from './DataProvider.emitter';

const applyUpdate = (text: string, startSelection: number, endSelection: number, replacement: string): string =>
  text.slice(0, startSelection) + replacement + text.slice(endSelection);

export interface DataProviderProps {
  accessToken: string;

  logout(): void;

  children?: React.ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ accessToken, logout, children }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [sharedNotes, setSharedNotes] = useState<Note[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>(ConnectionStatus.idle);
  const [currentNoteId, setCurrentNoteId] = useState('');
  const [userId, setUserId] = useState(0);
  const [username, setUsername] = useState('');

  const [sessionId, setSessionId] = useState('');

  const currentLocalChangeRef = useRef<LocalNoteChange | null>(null);
  const localChangesRef = useRef<LocalNoteChange[]>([]);
  const noteIdToVersion = useRef<Record<string, number>>({});

  const processNext = useCallback(() => {
    const change = localChangesRef.current.shift();
    currentLocalChangeRef.current = change ?? null;
    if (!change) return;
    const noteVersion = noteIdToVersion.current[change.noteId] ?? 0;
    sendJsonMessage({
      event: RequestType.noteUpdateRequest,
      data: { ...change, version: noteVersion + 1 },
    });
  }, []);

  const { sendJsonMessage, readyState } = useWebSocket(WS_URL, {
    shouldReconnect: () => {
      setConnectionStatus(ConnectionStatus.idle);
      currentLocalChangeRef.current = null;
      localChangesRef.current = [];
      return true;
    },
    onMessage: (message: WebSocketEventMap['message']) => {
      const { data: payload } = message;
      const { event, data } = JSON.parse(payload);
      switch (event) {
        case EventType.userConnected:
          if (sessionId !== data.sessionId) return;
          setUserId(data.userId);
          setUsername(data.username);
          setNotes(data.notes);
          setSharedNotes(data.sharedNotes);
          setConnectionStatus(ConnectionStatus.connected);
          (data.notes as Note[]).forEach(it => noteIdToVersion.current[it.id] = it.version);
          (data.sharedNotes as Note[]).forEach(it => noteIdToVersion.current[it.id] = it.version);
          return;
        case EventType.noteShared:
          setSharedNotes(prevNotes => [...prevNotes, {
            id: data.note.id,
            userId: data.note.userId,
            text: data.note.text,
            version: data.note.version,
          } as Note]);
          return;
        case EventType.noteCreated:
          setNotes(prevNotes => {
            if (prevNotes.some(it => it.id === data.noteId)) return prevNotes;

            return [...prevNotes, {
              id: data.noteId,
              userId: data.userId,
              text: '',
              version: 0,
            }];
          });
          return;
        case EventType.noteUpdated: {
          const localChange = currentLocalChangeRef.current?.id === data.clientId;
          const noLocalChanges = currentLocalChangeRef.current === null;
          noteIdToVersion.current[data.noteId] = data.noteVersion;
          setNotes(prevNotes => prevNotes.map(it => {
            if (it.id !== data.noteId) return it;

            const serverText = applyUpdate(it.text, data.startSelection, data.endSelection, data.replacement);

            if (noLocalChanges) {
              notifyNoteUpdated({
                nextText: serverText,
                change: data,
              });
            } else if (!localChange) {
              notifyNoteUpdated({
                nextText: [currentLocalChangeRef.current!!, ...localChangesRef.current]
                  .reduce((text, change) => applyUpdate(text, change.startSelection, change.endSelection, change.replacement), serverText),
                change: data,
              });
            }

            return {
              ...it,
              text: serverText,
              version: data.noteVersion,
            } as Note;
          }));
          if (currentLocalChangeRef.current === null) return;
          if (localChange) {
            processNext();
            return;
          }
          if (applyOpTransform(currentLocalChangeRef.current!!, data)) {
            localChangesRef.current.unshift(currentLocalChangeRef.current!!);
            processNext();
          }
          localChangesRef.current.forEach(it => applyOpTransform(it, data));
          return;
        }
        case EventType.eventRejected:
          if (currentLocalChangeRef.current?.id === data.rejectedClientId) {
            processNext();
          }
          return;
        default:
      }
    },
  });

  const emitNoteChange = useCallback((change: LocalNoteChange) => {
    localChangesRef.current.push(change);
    if (currentLocalChangeRef.current === null) {
      processNext();
    }
  }, [processNext]);

  const createNote = useCallback(() => {
    const id = uuid.v4();
    sendJsonMessage({
      event: RequestType.noteCreateRequest,
      data: { userId, id, noteId: id },
    });
    setNotes(prevNotes => [...prevNotes, {
      id,
      userId,
      text: '',
      version: 0,
    }]);
    setCurrentNoteId(id);
  }, [userId, sendJsonMessage]);

  useEffect(() => {
    if (readyState === ReadyState.OPEN && connectionStatus === ConnectionStatus.idle) {
      const id = uuid.v4();
      sendJsonMessage({
        event: RequestType.authCheckRequest,
        data: { accessToken, sessionId: id },
      });
      setSessionId(id);
      setConnectionStatus(ConnectionStatus.connecting);
    }
  }, [connectionStatus, readyState, sendJsonMessage]);


  const value: DataContextProps = useMemo(() => {
    return {
      accessToken,
      logout,
      notes,
      sharedNotes,
      connectionStatus,
      currentNoteId,
      userId,
      username,
      emitNoteChange,
      selectNote: setCurrentNoteId,
      createNote,
    };
  }, [
    accessToken,
    logout,
    notes,
    sharedNotes,
    connectionStatus,
    currentNoteId,
    userId,
    username,
  ]);

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
