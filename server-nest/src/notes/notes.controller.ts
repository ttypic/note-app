import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AuthGuard, JwtPayload } from '../auth/auth.guard';
import { NoteShareClientRequest, NoteShareRequestBody } from './notes.dto';
import { RequestType } from './event.type';

@Controller()
export class NotesController {
  constructor(private eventEmitter: EventEmitter2) {
  }

  @UseGuards(AuthGuard)
  @Post('share')
  shareNote(@JwtPayload() jwtPayload: JwtPayload, @Body() noteShareRequest: NoteShareRequestBody) {
    const noteSharedClientRequest: NoteShareClientRequest = {
      userId: jwtPayload.sub,
      ...noteShareRequest,
    };

    this.eventEmitter.emit(RequestType.shareNoteRequest, noteSharedClientRequest);
  }
}
