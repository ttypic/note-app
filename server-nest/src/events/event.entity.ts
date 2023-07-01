import { Column, CreatedAt, ForeignKey, Model, Table, Unique } from 'sequelize-typescript';
import { User } from '../users/user.entity';

@Table
export class Event extends Model {
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
  command: string;

  @Column
  sessionId: string;

  /**
   * Rejected event's clientId (because of duplication or conflict)
   */
  @Column
  rejectedClientId: string;

  @Column
  noteId: string;

  @Column
  startSelection: number;

  @Column
  endSelection: number;

  @Column
  replacement: string;

  @CreatedAt
  creationDate: Date;
}
