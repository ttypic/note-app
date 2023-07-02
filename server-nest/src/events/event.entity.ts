import { Column, ForeignKey, IsUUID, Model, PrimaryKey, Table, Unique } from 'sequelize-typescript';
import { User } from '../users/user.entity';

// noinspection JSAnnotator
@Table
export class Event extends Model<Event> {
  @IsUUID(4)
  @PrimaryKey
  @Column
  serverId: string;

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
