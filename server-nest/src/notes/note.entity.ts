import { Column, ForeignKey, Index, IsUUID, Model, PrimaryKey, Table, Unique } from 'sequelize-typescript';
import { User } from '../users/user.entity';

// noinspection JSAnnotator
@Table({ version: true })
export class Note extends Model<Note> {
  @PrimaryKey
  @Column
  id: string;

  @Index
  @Column
  @ForeignKey(() => User)
  userId: number;

  @Column
  text: string;
}

// noinspection JSAnnotator
@Table
export class SharedNote extends Model<SharedNote> {
  @Column
  @ForeignKey(() => User)
  userId: number;

  @Index
  @Column
  @ForeignKey(() => Note)
  noteId: string;
}


// noinspection JSAnnotator
@Table
export class AppliedEvent extends Model<AppliedEvent> {
  @IsUUID(4)
  @PrimaryKey
  @Column
  serverId: string;

  @Column
  eventStoreId: number;

  @Column
  @ForeignKey(() => User)
  userId: number;

  /**
   * Some kind of idempotency key we generate on client for the event
   */
  @Unique
  @Column
  clientId: string;

  @Column
  eventType: string;

  @Column
  noteId: string;

  @Column
  noteVersion: number;

  @Column
  startSelection: number;

  @Column
  endSelection: number;

  @Column
  replacement: string;

  /**
   * Rejected event's clientId (because of duplication or conflict)
   */
  @Column
  rejectedClientId: string;
}
