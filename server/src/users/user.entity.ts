import { Column, Model, Table, Unique } from 'sequelize-typescript';

// noinspection JSAnnotator
@Table
export class User extends Model<User> {
  @Unique
  @Column
  username: string;

  @Column
  password: string;
}
