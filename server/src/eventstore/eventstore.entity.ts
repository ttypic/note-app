import { Column, Model, Table } from 'sequelize-typescript';

// noinspection JSAnnotator
@Table
export class EventStore extends Model<EventStore> {

  @Column
  userId: number;

  @Column
  clientId: string;

  @Column
  requestType: string;

  @Column
  noteId: string;

  @Column
  sessionId: string;

  @Column
  version: number;

  @Column
  startSelection: number;

  @Column
  endSelection: number;

  @Column
  replacement: string;

  @Column
  sharedWith: string;

}
