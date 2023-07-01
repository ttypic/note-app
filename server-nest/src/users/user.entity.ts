import { Table, Column, Unique, Model } from 'sequelize-typescript';

@Table
export class User extends Model {
  @Unique
  @Column
  username: string;

  @Column
  password: string;
}
