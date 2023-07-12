import React, { ChangeEventHandler, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import * as uuid from 'uuid';
import { NoteUpdatedPayload, useAppData } from 'providers/DataProvider';
import { applyUpdate, calculateDiff, SelectionRange } from 'utils/calculateDiff';
import { useValueRef } from 'utils/useValueRef';
import { ArrowLeftIcon } from 'components/Icon';
import { BackButton, NoteHeader, NoteTextarea, NoteTextareaContainer } from './NoteContainer.styled';
import { NoteShareButton } from '../NoteShareButton';

interface NoteContainerProps {
  defaultText: string;
}

const getCursorPosition = (textarea: HTMLTextAreaElement | null): SelectionRange | undefined => {
  const start = textarea?.selectionStart;
  if (typeof start !== 'number') return undefined;

  return {
    start,
    end: textarea?.selectionEnd ?? 0,
  };
};

export const NoteContainer: React.FC<NoteContainerProps> = ({ defaultText }) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const selectionRef = useRef<SelectionRange>({ start: 0, end: 0 });

  const [value, setValue] = useState(defaultText);
  const { accessToken, userId, currentNoteId, emitNoteChange, selectNote } = useAppData({
    onNoteUpdated: (payload: NoteUpdatedPayload) => {
      if (payload.change.noteId !== currentNoteId) return;

      setValue(payload.nextText);

      const shift = payload.change.replacement.length - (payload.change.endSelection - payload.change.startSelection);
      if (payload.change.endSelection <= selectionRef.current.start) {
        selectionRef.current.start += shift;
        selectionRef.current.end += shift;
      }
    },
  });
  const valueRef = useValueRef(value);

  const handleChange = useCallback<ChangeEventHandler<HTMLTextAreaElement>>(event => {
    const nextValue = event.target.value;
    const prevPosition = selectionRef.current;
    const nextPosition = getCursorPosition(textareaRef.current) ?? { start: 0, end: 0 };
    selectionRef.current = nextPosition;
    const diff = calculateDiff(valueRef.current, nextValue, prevPosition, nextPosition);

    if (applyUpdate(valueRef.current, diff.startSelection, diff.endSelection, diff.replacement) !== nextValue) {
      console.warn('Wrong diff calculated', valueRef.current, nextValue, prevPosition, nextPosition);
      return;
    }

    emitNoteChange({
      id: uuid.v4(),
      userId,
      noteId: currentNoteId,
      ...diff,
    });
    setValue(nextValue);
  }, [emitNoteChange, userId, currentNoteId, valueRef]);

  const handleBackClick = useCallback(() => {
    selectNote('');
  }, [selectNote]);

  useLayoutEffect(() => {
    if (!textareaRef.current?.selectionStart) return;

    if (selectionRef.current.start !== textareaRef.current?.selectionStart) {
      textareaRef.current?.setSelectionRange(selectionRef.current.start, selectionRef.current.end);
    }
  });

  useEffect(() => {
    const listener = () => {
      const cursorPosition = getCursorPosition(textareaRef.current);
      if (!cursorPosition) return;
      selectionRef.current = cursorPosition;
    };

    document.addEventListener('selectionchange', listener);

    return () => {
      document.removeEventListener('selectionchange', listener);
    };
  }, []);

  return (
    <NoteTextareaContainer>
      <NoteHeader>
        <BackButton onClick={handleBackClick}>
          <ArrowLeftIcon />
        </BackButton>
        <NoteShareButton accessToken={accessToken} noteId={currentNoteId} />
      </NoteHeader>
      {currentNoteId && <NoteTextarea ref={textareaRef} value={value} onChange={handleChange} />}
    </NoteTextareaContainer>
  );
};
