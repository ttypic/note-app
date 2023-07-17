import { EventEmitter, on } from 'node:events';
import { Inject, Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { Sequelize } from 'sequelize-typescript';
import { SEQUELIZE } from '../db/consts';
import { NotesService } from '../notes/notes.service';
import { EventType, RequestType } from '../notes/event.type';
import {
  NoteCreateClientRequest,
  NoteShareClientRequest,
  NoteUpdateClientRequest,
  UserConnectClientRequest,
} from '../notes/notes.dto';
import { EventStore } from './eventstore.entity';

/**
 * Reads, stores, consumes incoming requests and broadcasts processed events
 *
 * This service implemented two abstractions:
 *
 * - MessageBroker - it sequentially registers incoming requests and communicates with WebSocket controller.
 *
 * - Events stream transformer - it applies or declines incoming requests and sends information back to MessageBroker
 */
@Injectable()
export class EventStoreService implements OnModuleInit, OnModuleDestroy {
  private ac = new AbortController();
  private sequentialProducer = new EventEmitter();
  private sequentialConsumer = new EventEmitter();

  constructor(
    @Inject(SEQUELIZE)
    private sequelize: Sequelize,
    private notesService: NotesService,
    private eventEmitter: EventEmitter2,
  ) {
  }

  async onModuleInit() {
    // todo recover all unsent events before
    this.produceSequentially();
    this.consumeSequentially();
  }

  @OnEvent(RequestType.noteCreateRequest)
  handelNoteCreateRequest(data: NoteCreateClientRequest) {
    const event: Partial<EventStore> = {
      requestType: RequestType.noteCreateRequest,
      clientId: data.id,
      userId: data.userId,
      noteId: data.noteId,
    };
    this.sequentialProducer.emit('produce', event);
  }

  @OnEvent(RequestType.noteUpdateRequest)
  handelNoteUpdateRequest(data: NoteUpdateClientRequest) {
    const event: Partial<EventStore> = {
      requestType: RequestType.noteUpdateRequest,
      clientId: data.id,
      userId: data.userId,
      noteId: data.noteId,
      startSelection: data.startSelection,
      endSelection: data.endSelection,
      replacement: data.replacement,
      version: data.version,
    };
    this.sequentialProducer.emit('produce', event);
  }

  @OnEvent(RequestType.userConnectRequest)
  handelUserConnectRequest(data: UserConnectClientRequest) {
    const event: Partial<EventStore> = {
      requestType: RequestType.userConnectRequest,
      sessionId: data.sessionId,
      userId: data.userId,
    };
    this.sequentialProducer.emit('produce', event);
  }

  @OnEvent(RequestType.shareNoteRequest)
  handelNoteShareRequest(data: NoteShareClientRequest) {
    const event: Partial<EventStore> = {
      requestType: RequestType.shareNoteRequest,
      userId: data.userId,
      noteId: data.noteId,
      sharedWith: data.sharedWith,
    };
    this.sequentialProducer.emit('produce', event);
  }

  async onModuleDestroy() {
    this.ac.abort();
  }

  private async produceSequentially() {
    for await (const [eventData] of on(this.sequentialProducer, 'produce', { signal: this.ac.signal })) {
      const savedEvent = await this.handleEventProducing(eventData);
      this.sequentialConsumer.emit('consume', savedEvent);
    }
  }

  private async handleEventProducing(eventData: EventStore) {
    return await this.sequelize.getRepository(EventStore).create(eventData);
  }

  private async consumeSequentially() {
    for await (const [eventData] of on(this.sequentialConsumer, 'consume', { signal: this.ac.signal })) {
      await this.handleEventConsuming(eventData);
    }
  }

  private async handleEventConsuming(request: EventStore) {
    switch (request.requestType) {
      case RequestType.noteCreateRequest: {
        const appliedEvent = await this.notesService.createNote({
          clientId: request.clientId,
          eventId: request.id,
          userId: request.userId,
          noteId: request.noteId,
        });
        this.eventEmitter.emit(appliedEvent.eventType, appliedEvent);
        return;
      }
      case RequestType.noteUpdateRequest: {
        const { appliedEvent, userIds } = await this.notesService.updateNote({
          clientId: request.clientId,
          eventId: request.id,
          userId: request.userId,
          noteId: request.noteId,
          startSelection: request.startSelection,
          endSelection: request.endSelection,
          replacement: request.replacement,
          version: request.version,
        });
        userIds.forEach(userId => {
          this.eventEmitter.emit(appliedEvent.eventType, { ...appliedEvent.dataValues, userId });
        });
        return;
      }
      case RequestType.userConnectRequest: {
        try {
          const userState = await this.notesService.getUserState(request.userId, request.sessionId);
          this.eventEmitter.emit(EventType.userConnected, userState);
        } catch {
        }
        return;
      }
      case RequestType.shareNoteRequest: {
        try {
          const response = await this.notesService.shareNote(request.userId, request.noteId, request.sharedWith);
          this.eventEmitter.emit(EventType.noteShared, response);
        } catch {
        }
        return;
      }
      default:
    }
  }
}
