import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import uuid from 'uuid';
import { SEQUELIZE } from '../db/consts';
import { Note, SharedNote } from './note.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UsersService } from '../users/users.service';
import { Event } from '../events/event.entity';
import { EventType } from '../events/event.type';
import { NoteCreatedPayload, NoteUpdatedPayload } from '../events/events.dto';
import { UserStateResponse } from './notes.dto';

function applyUpdate(text: string, startSelection: number, endSelection: number, replacement: string): string {
  return text.slice(0, startSelection) + replacement + text.slice(endSelection);
}

@Injectable()
export class NotesService {
  constructor(
    @Inject(SEQUELIZE)
    private sequelize: Sequelize,
    private usersService: UsersService,
    private eventEmitter: EventEmitter2,
  ) {
  }

  async createNote(data: NoteCreatedPayload) {
    const { id: clientId, userId, noteId } = data;
    const event = await this.sequelize.transaction(async tx => {
      await this.sequelize.getRepository(Note).create({
        id: noteId,
        userId,
        text: '',
      }, { transaction: tx });

      return this.sequelize.getRepository(Event).create({
        serverId: uuid.v4(),
        userId,
        clientId,
        eventType: EventType.noteCreated,
        noteId,
      }, { transaction: tx });
    });

    this.eventEmitter.emit(EventType.noteCreated, event);
  }

  async updateNote(data: NoteUpdatedPayload) {
    const { id: clientId, userId, noteId, startSelection, endSelection, replacement } = data;

    try {
      const { event, userIds } = await this.sequelize.transaction(async tx => {
        const note = await this.sequelize.getRepository(Note).findByPk(noteId, {
          transaction: tx,
          lock: tx.LOCK.UPDATE,
        });

        await this.sequelize.getRepository(Note).update({
          text: applyUpdate(note.text, startSelection, endSelection, replacement),
        }, {
          where: { id: noteId },
          transaction: tx,
        });

        const event = this.sequelize.getRepository(Event).create({
          serverId: uuid.v4(),
          userId,
          clientId,
          eventType: EventType.noteUpdated,
          noteId,
          startSelection,
          endSelection,
          replacement,
        }, { transaction: tx });

        const sharedUsers = await this.sequelize.getRepository(SharedNote).findAll({
          where: { noteId },
          transaction: tx,
          lock: tx.LOCK.UPDATE,
        });

        const userIds = [...sharedUsers.map(it => it.userId), userId];

        return { event, userIds };
      });

      userIds.forEach(it => {
        this.eventEmitter.emit(EventType.noteUpdated, { ...event, userId: it });
      });
    } catch (error) {
      const event = await this.sequelize.getRepository(Event).create({
        serverId: uuid.v4(),
        userId,
        clientId: uuid.v4(),
        eventType: EventType.eventRejected,
        noteId,
        rejectedClientId: clientId,
      });
      this.eventEmitter.emit(EventType.eventRejected, event);
    }
  }

  async shareNote(userId: number, noteId: string, sharedWith: string) {
    const sharedWithUser = await this.usersService.tryFindOne(sharedWith);
    if (sharedWithUser == null) throw new BadRequestException();
    const event = await this.sequelize.transaction(async tx => {
      await this.sequelize.getRepository(SharedNote).create({
        noteId,
        userId: sharedWithUser.id,
      }, { transaction: tx });
      return this.sequelize.getRepository(Event).create({
        serverId: uuid.v4(),
        userId,
        eventType: EventType.noteShared,
        noteId,
      });
    });
    this.eventEmitter.emit(EventType.noteShared, event);
  }

  async getUserState(userId: number): Promise<UserStateResponse> {
    return this.sequelize.transaction(async tx => {
      const notes = await this.sequelize.getRepository(Note).findAll({
        where: { userId: userId },
        transaction: tx,
      });

      const sharedNoteRecords = await this.sequelize.getRepository(SharedNote).findAll({
        where: { userId: userId },
        transaction: tx,
      });

      const sharedNotes = await this.sequelize.getRepository(Note).findAll({
        where: { id: sharedNoteRecords.map(it => it.noteId) },
        transaction: tx,
      });

      const lastEvent = await this.sequelize.getRepository(Event).findAll({
        limit: 1,
        order: [
          ['createdAt', 'DESC'],
        ],
        transaction: tx,
      });

      return {
        userId,
        notes,
        sharedNotes,
        lastEventTimestamp: lastEvent[0]?.createdAt,
      };
    });
  }
}
