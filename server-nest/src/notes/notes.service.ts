import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { Op } from 'sequelize';
import * as uuid from 'uuid';
import { SEQUELIZE } from '../db/consts';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';
import { EventType } from './event.type';
import { AppliedEvent, Note, SharedNote } from './note.entity';
import {
  NoteCreateRequest,
  NoteSharedResponse,
  NoteUpdatedResponse,
  NoteUpdateRequest,
  UserStateResponse,
} from './notes.dto';

function applyUpdate(text: string, startSelection: number, endSelection: number, replacement: string): string {
  return text.slice(0, startSelection) + replacement + text.slice(endSelection);
}

@Injectable()
export class NotesService {
  constructor(
    @Inject(SEQUELIZE)
    private sequelize: Sequelize,
    private usersService: UsersService,
  ) {
  }

  async createNote(data: NoteCreateRequest): Promise<AppliedEvent> {
    const { clientId: clientId, userId, noteId } = data;
    try {
      return await this.sequelize.transaction(async tx => {
        await this.sequelize.getRepository(Note).create({
          id: noteId,
          userId,
          text: '',
          version: 0,
        }, { transaction: tx });

        return this.sequelize.getRepository(AppliedEvent).create({
          serverId: uuid.v4(),
          eventStoreId: data.eventId,
          userId,
          clientId,
          eventType: EventType.noteCreated,
          noteId,
        }, { transaction: tx });
      });
    } catch {
      return await this.sequelize.getRepository(AppliedEvent).create({
        serverId: uuid.v4(),
        eventStoreId: data.eventId,
        userId,
        clientId: uuid.v4(),
        eventType: EventType.eventRejected,
        noteId,
        rejectedClientId: clientId,
      });
    }
  }

  async updateNote(data: NoteUpdateRequest): Promise<NoteUpdatedResponse> {
    const { clientId: clientId, userId, noteId, startSelection, endSelection, replacement, version } = data;

    try {
      return await this.sequelize.transaction(async tx => {
        const note = await this.sequelize.getRepository(Note).findByPk(noteId, {
          transaction: tx,
        });

        // noinspection TypeScriptValidateTypes
        const [affectedCount] = await this.sequelize.getRepository(Note).update({
          text: applyUpdate(note.text, startSelection, endSelection, replacement),
          version,
        }, {
          where: { id: noteId, version: { [Op.lt]: version } },
          transaction: tx,
        });

        if (affectedCount === 0) throw Error('Version conflict');

        const appliedEvent = await this.sequelize.getRepository(AppliedEvent).create({
          serverId: uuid.v4(),
          eventStoreId: data.eventId,
          noteVersion: version,
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
        });

        const userIds = [...sharedUsers.map(it => it.userId), userId];

        return { appliedEvent, userIds };
      });
    } catch {
      const appliedEvent = await this.sequelize.getRepository(AppliedEvent).create({
        serverId: uuid.v4(),
        eventStoreId: data.eventId,
        userId,
        clientId: uuid.v4(),
        eventType: EventType.eventRejected,
        noteId,
        rejectedClientId: clientId,
      });
      return { appliedEvent, userIds: [userId] };
    }
  }

  async shareNote(userId: number, noteId: string, sharedWith: string): Promise<NoteSharedResponse> {
    const sharedWithUser = await this.usersService.tryFindOne(sharedWith);
    if (sharedWithUser == null) throw new BadRequestException();
    return this.sequelize.transaction(async tx => {
      await this.sequelize.getRepository(SharedNote).create({
        noteId,
        userId: sharedWithUser.id,
      }, { transaction: tx });
      const note = await this.sequelize.getRepository(Note).findByPk(noteId, {
        transaction: tx,
      });
      return { userId: sharedWithUser.id, note };
    });
  }

  async getUserState(userId: number, sessionId: string): Promise<UserStateResponse> {
    const user = await this.sequelize.getRepository(User).findByPk(userId);

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

      const lastEvent = await this.sequelize.getRepository(AppliedEvent).findAll({
        limit: 1,
        order: [
          ['createdAt', 'DESC'],
        ],
        transaction: tx,
      });

      return {
        sessionId,
        userId,
        username: user.username,
        notes,
        sharedNotes,
        lastEventId: lastEvent[0]?.eventStoreId ?? 0,
      };
    });
  }
}
