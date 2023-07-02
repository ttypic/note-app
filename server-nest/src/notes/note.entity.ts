import { Column, ForeignKey, Index, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { User } from '../users/user.entity';

// noinspection JSAnnotator
@Table
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

