import { Column, CreatedAt, ForeignKey, Model, PrimaryKey, Table, UpdatedAt } from 'sequelize-typescript';
import { User } from '../users/user.entity';

@Table
export class Note extends Model {
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

@Table
export class SharedNote extends Model {
  @Column
  @ForeignKey(() => User)
  userId: number;

  @Column
  @ForeignKey(() => Note)
  noteId: string;
}

