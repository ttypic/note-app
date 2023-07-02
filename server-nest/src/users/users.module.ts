import { Module } from '@nestjs/common';
import { DatabaseModule } from '../db/database.module';
import { UsersService } from './users.service';

@Module({
  imports: [DatabaseModule],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {
}
