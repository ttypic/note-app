import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { OnEvent } from '@nestjs/event-emitter';
import WebSocket, { Server } from 'ws';
import { EventType } from '../events/event.type';
import {
  EventRejectedPayload,
  NoteCreatedPayload,
  NoteSharedPayload,
  NoteUpdatedPayload,
} from '../events/events.dto';
import { NotesService } from '../notes/notes.service';

@WebSocketGateway(8001, { path: 'ws' })
export class WsGateway {

  constructor(private readonly noteService: NotesService) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage(EventType.noteCreated)
  handelNoteCreatedOnClient(@ConnectedSocket() client: WebSocket, @MessageBody() data: NoteCreatedPayload) {
    this.noteService.createNote(data)
  }

  @SubscribeMessage(EventType.noteUpdated)
  handelNoteUpdatedOnClient(@ConnectedSocket() client: WebSocket, @MessageBody() data: NoteUpdatedPayload) {
    this.noteService.updateNote(data)
  }

  @OnEvent(EventType.noteCreated)
  handelNoteCreated(data: NoteCreatedPayload) {
    this.server.clients.forEach(client => {
      client.send(JSON.stringify({
        event: EventType.noteCreated,
        data,
      }));
    });
  }

  @OnEvent(EventType.noteUpdated)
  handelNoteUpdated(data: NoteUpdatedPayload) {
    this.server.clients.forEach(client => {
      client.send(JSON.stringify({
        event: EventType.noteUpdated,
        data,
      }));
    });
  }

  @OnEvent(EventType.noteShared)
  handleNoteShared(data: NoteSharedPayload) {
    this.server.clients.forEach(client => {
      client.send(JSON.stringify({
        event: EventType.noteShared,
        data,
      }));
    });
  }

  @OnEvent(EventType.eventRejected)
  handleEventRejected(data: EventRejectedPayload) {
    this.server.clients.forEach(client => {
      client.send(JSON.stringify({
        event: EventType.eventRejected,
        data,
      }));
    });
  }
}
