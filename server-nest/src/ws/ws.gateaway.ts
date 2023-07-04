import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import WebSocket, { OPEN, Server } from 'ws';
import { JwtService } from '@nestjs/jwt';
import { EventType, RequestType } from '../notes/event.type';
import { getJwtSecret } from '../auth/secrtet';
import {
  NoteCreateClientRequest,
  NoteSharedResponse,
  NoteUpdateClientRequest,
  UserStateResponse,
} from '../notes/notes.dto';
import { AppliedEvent } from '../notes/note.entity';

interface Session {
  userId: number;
  sessionId: string;
}

interface AuthRequest {
  accessToken: string;
  sessionId: string;
}

@WebSocketGateway(8001, { path: 'ws' })
export class WsGateway {

  authorizedClients = new WeakMap<WebSocket, Session>();

  constructor(private jwtService: JwtService, private eventEmitter: EventEmitter2) {
  }

  @WebSocketServer()
  server: Server;

  @SubscribeMessage(RequestType.authCheckRequest)
  async handelAuth(@ConnectedSocket() client: WebSocket, @MessageBody() authRequest: AuthRequest) {
    const { accessToken, sessionId } = authRequest;
    try {
      const payload: JwtPayload = await this.jwtService.verifyAsync(
        accessToken,
        {
          secret: getJwtSecret(),
        },
      );
      const userId = payload.sub;
      this.authorizedClients.set(client, { userId, sessionId });
      this.eventEmitter.emit(RequestType.userConnectRequest, { userId, sessionId });
    } catch {
      await client.close(1011, 'authentication failed');
    }
  }

  @SubscribeMessage(RequestType.noteCreateRequest)
  async handelNoteCreateRequest(@ConnectedSocket() client: WebSocket, @MessageBody() data: NoteCreateClientRequest) {
    if (this.authorizedClients.has(client)) {
      this.eventEmitter.emit(RequestType.noteCreateRequest, data);
    }
  }

  @SubscribeMessage(RequestType.noteUpdateRequest)
  async handelNoteUpdateRequest(@ConnectedSocket() client: WebSocket, @MessageBody() data: NoteUpdateClientRequest) {
    if (this.authorizedClients.has(client)) {
      this.eventEmitter.emit(RequestType.noteUpdateRequest, data);
    }
  }

  @OnEvent(EventType.noteCreated)
  handelNoteCreated(data: AppliedEvent) {
    this.server.clients.forEach(client => {
      if (client.readyState === OPEN && this.authorizedClients.get(client)?.userId == data.userId) {
        client.send(JSON.stringify({
          event: EventType.noteCreated,
          data,
        }));
      }
    });
  }

  @OnEvent(EventType.noteUpdated)
  handelNoteUpdated(data: AppliedEvent) {
    this.server.clients.forEach(client => {
      if (client.readyState === OPEN && this.authorizedClients.get(client)?.userId == data.userId) {
        client.send(JSON.stringify({
          event: EventType.noteUpdated,
          data,
        }));
      }
    });
  }

  @OnEvent(EventType.noteShared)
  handleNoteShared(data: NoteSharedResponse) {
    this.server.clients.forEach(client => {
      if (client.readyState === OPEN && this.authorizedClients.get(client)?.userId == data.userId) {
        client.send(JSON.stringify({
          event: EventType.noteShared,
          data,
        }));
      }
    });
  }

  @OnEvent(EventType.eventRejected)
  handleEventRejected(data: AppliedEvent) {
    this.server.clients.forEach(client => {
      if (client.readyState === OPEN && this.authorizedClients.get(client)?.userId == data.userId) {
        client.send(JSON.stringify({
          event: EventType.eventRejected,
          data,
        }));
      }
    });
  }

  @OnEvent(EventType.userConnected)
  handleUserConnected(data: UserStateResponse) {
    this.server.clients.forEach(client => {
      if (client.readyState === OPEN && this.authorizedClients.get(client)?.sessionId == data.sessionId) {
        client.send(JSON.stringify({
          event: EventType.userConnected,
          data,
        }));
      }
    });
  }
}
