import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard, JwtPayload } from '../auth/auth.guard';
import { NotesService } from './notes.service';
import { NoteShareRequest } from './notes.dto';

@Controller()
export class NotesController {
  constructor(private readonly noteService: NotesService) {}

  @UseGuards(AuthGuard)
  @Post('connect')
  connect(@JwtPayload() jwtPayload: JwtPayload) {
    const userId = jwtPayload.sub;
    return this.noteService.getUserState(userId);
  }

  @UseGuards(AuthGuard)
  @Post('share')
  shareNote(@JwtPayload() jwtPayload: JwtPayload, @Body() noteShareRequest: NoteShareRequest) {
    const userId = jwtPayload.sub;
    return this.noteService.shareNote(userId, noteShareRequest.noteId, noteShareRequest.sharedWith);
  }
}
