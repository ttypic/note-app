import { ExternalNoteChange, LocalNoteChange } from './DataContext.types';
import * as uuid from 'uuid';

export const applyOpTransform = (localChange: LocalNoteChange, externalChange: ExternalNoteChange): boolean => {
  if (localChange.noteId !== externalChange.noteId) return false;
  const shift = externalChange.replacement.length - (externalChange.endSelection - externalChange.startSelection);
  if (externalChange.endSelection <= localChange.startSelection) {
    localChange.id = uuid.v4();
    localChange.startSelection = localChange.startSelection + shift;
    localChange.endSelection = localChange.endSelection + shift;
    return true;
  }
  localChange.id = uuid.v4();
  return true;
};
