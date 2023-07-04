export enum EventType {
  noteCreated = 'noteCreated',
  noteUpdated = 'noteUpdated',
  noteShared = 'noteShared',
  userConnected = 'userConnected',
  eventRejected = 'eventRejected',
}

export enum RequestType {
  authCheckRequest = 'authCheckRequest',
  noteCreateRequest = 'noteCreateRequest',
  noteUpdateRequest = 'noteUpdateRequest',
  userConnectRequest = 'userConnectRequest',
  shareNoteRequest = 'shareNoteRequest',
}
