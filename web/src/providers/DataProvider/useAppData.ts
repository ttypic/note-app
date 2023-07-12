import { useContext, useEffect, useMemo } from 'react';
import { DataContext } from './DataContext';
import { Note } from './DataContext.types';
import { NoteUpdatedPayload, subscribeNoteUpdated } from './DataProvider.emitter';
import { useValueRef } from '../../utils/useValueRef';

interface UseAppDataArgs {
  onNoteUpdated?(payload: NoteUpdatedPayload): void;
}

export const useAppData = ({ onNoteUpdated }: UseAppDataArgs = {}) => {
  const context = useContext(DataContext);
  const onNoteUpdatedRef = useValueRef(onNoteUpdated);

  const currentNote: Note | undefined = useMemo(() => {
    return [...context.notes, ...context.sharedNotes].find(it => it.id === context.currentNoteId);
  }, [context.sharedNotes, context.notes, context.currentNoteId]);

  useEffect(() => {
    return subscribeNoteUpdated((payload) => {
      onNoteUpdatedRef.current?.(payload);
    });
  }, [onNoteUpdatedRef]);

  return {
    ...context,
    currentNote,
  };
};
