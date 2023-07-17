import { Module } from '@nestjs/common';
import { WsGateway } from './ws.gateaway';
import { NotesModule } from '../notes/notes.module';

@Module({
  imports: [NotesModule],
  providers: [WsGateway],
})
export class WsModule {
}
