import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AuthModule } from './auth/auth.module';
import { WsModule } from './ws/ws.module';
import { EventStoreModule } from './eventstore/eventstore.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    EventEmitterModule.forRoot(),
    EventStoreModule,
    AuthModule,
    WsModule,
  ],
})
export class AppModule {
}
