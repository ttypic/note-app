import { Module } from '@nestjs/common';
import { NotesModule } from '../notes/notes.module';
import { EventStoreService } from './eventstore.service';
import { DatabaseModule } from '../db/database.module';

@Module({
  imports: [DatabaseModule, NotesModule],
  providers: [EventStoreService],
})
export class EventStoreModule {
}
