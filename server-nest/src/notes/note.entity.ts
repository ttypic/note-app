import { Column, CreatedAt, ForeignKey, Model, PrimaryKey, Table, UpdatedAt } from 'sequelize-typescript';
import { User } from '../users/user.entity';

// noinspection JSAnnotator
@Table
export class Note extends Model<Note> {
  @PrimaryKey
  @Column
  id: string;

  @Column
  @ForeignKey(() => User)
  userId: number;

  @Column
  text: string;

  @CreatedAt
  creationDate: Date;

  @UpdatedAt
  updatedOn: Date;
}

// noinspection JSAnnotator
@Table
export class SharedNote extends Model<SharedNote> {
  @Column
  @ForeignKey(() => User)
  userId: number;

  @Column
  @ForeignKey(() => Note)
  noteId: string;
}

