import { Sequelize } from 'sequelize-typescript';
import { Inject, Injectable } from '@nestjs/common';
import { SEQUELIZE } from '../db/consts';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @Inject(SEQUELIZE)
    private sequelize: Sequelize,
  ) {
  }

  async tryFindOne(username: string): Promise<User | null> {
    return this.sequelize.getRepository(User).findOne({
      where: { username: username },
    });
  }

  async save(username: string, passwordHash: string): Promise<User> {
    return this.sequelize.getRepository(User).create({
      username,
      password: passwordHash,
    });
  }
}
