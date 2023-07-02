import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { OnEvent } from '@nestjs/event-emitter';
import WebSocket, { Server } from 'ws';
import { EventType } from '../events/event.type';
import { EventRejectedPayload, NoteCreatedPayload, NoteSharedPayload, NoteUpdatedPayload } from '../events/events.dto';
import { NotesService } from '../notes/notes.service';
import { JwtService } from '@nestjs/jwt';
import { getJwtSecret } from '../auth/secrtet';

const AUTH_CHECK = 'authChecked';

@WebSocketGateway(8001, { path: 'ws' })
export class WsGateway {

  constructor(private readonly noteService: NotesService, private jwtService: JwtService) {
  }

  authorizedClients = new WeakMap<WebSocket, number>();

  @WebSocketServer()
  server: Server;

  @SubscribeMessage(AUTH_CHECK)
  async handelAuth(@ConnectedSocket() client: WebSocket, @MessageBody('accessToken') accessToken: string) {
    try {
      const payload: JwtPayload = await this.jwtService.verifyAsync(
        accessToken,
        {
          secret: getJwtSecret(),
        },
      );
      const userId = payload.sub;
      this.authorizedClients.set(client, userId);
      return { success: true };
    } catch {
      await client.close(1011, 'authentication failed');
    }
  }

  @SubscribeMessage(EventType.noteCreated)
  async handelNoteCreatedOnClient(@ConnectedSocket() client: WebSocket, @MessageBody() data: NoteCreatedPayload) {
    if (this.authorizedClients.has(client)) {
      await this.noteService.createNote(data);
    }
  }

  @SubscribeMessage(EventType.noteUpdated)
  async handelNoteUpdatedOnClient(@ConnectedSocket() client: WebSocket, @MessageBody() data: NoteUpdatedPayload) {
    if (this.authorizedClients.has(client)) {
      await this.noteService.updateNote(data);
    }
  }

  @OnEvent(EventType.noteCreated)
  handelNoteCreated(data: NoteCreatedPayload) {
    this.server.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN && this.authorizedClients.get(client) == data.userId) {
        client.send(JSON.stringify({
          event: EventType.noteCreated,
          data,
        }));
      }
    });
  }

  @OnEvent(EventType.noteUpdated)
  handelNoteUpdated(data: NoteUpdatedPayload) {
    this.server.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN && this.authorizedClients.get(client) == data.userId) {
        client.send(JSON.stringify({
          event: EventType.noteUpdated,
          data,
        }));
      }
    });
  }

  @OnEvent(EventType.noteShared)
  handleNoteShared(data: NoteSharedPayload) {
    this.server.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN && this.authorizedClients.get(client) == data.userId) {
        client.send(JSON.stringify({
          event: EventType.noteShared,
          data,
        }));
      }
    });
  }

  @OnEvent(EventType.eventRejected)
  handleEventRejected(data: EventRejectedPayload) {
    this.server.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN && this.authorizedClients.get(client) == data.userId) {
        client.send(JSON.stringify({
          event: EventType.eventRejected,
          data,
        }));
      }
    });
  }
}
