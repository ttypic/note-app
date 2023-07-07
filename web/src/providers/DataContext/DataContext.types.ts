export enum ConnectionStatus {
  idle = 'idle',
  connecting = 'connecting',
  connected = 'connected',
  disconnected = 'disconnected',
}

export interface Note {
  id: string;
  userId: number;
  version: number;
  text: string;
}

export interface LocalNoteChange {
  id: string;
  userId: number;
  noteId: string;
  startSelection: number;
  endSelection: number;
  replacement: string;
}

export interface ExternalNoteChange {
  serverId: string;
  clientId: string;
  userId: number;
  noteId: string;
  startSelection: number;
  endSelection: number;
  replacement: string;
}
