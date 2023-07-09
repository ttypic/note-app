import React, { ChangeEventHandler, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import * as uuid from 'uuid';
import { NoteUpdatedPayload, useAppData } from 'providers/DataProvider';
import { calculateDiff, SelectionRange } from 'utils/calculateDiff';
import { useValueRef } from 'utils/useValueRef';
import { ArrowLeftIcon } from 'components/Icon';
import { BackButton, NoteHeader, NoteTextarea, NoteTextareaContainer } from './NoteContainer.styled';

interface NoteContainerProps {
  defaultText: string;
}

const getCursorPosition = (textarea: HTMLTextAreaElement | null): SelectionRange | undefined => {
  const start = textarea?.selectionStart;
  if (!start) return undefined;

  return {
    start,
    end: textarea?.selectionEnd ?? start,
  };
};

export const NoteContainer: React.FC<NoteContainerProps> = ({ defaultText }) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const selectionRef = useRef<SelectionRange>({ start: 0, end: 0 });

  const [value, setValue] = useState(defaultText);
  const { userId, currentNoteId, emitNoteChange, selectNote } = useAppData({
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
    setValue(nextValue);
    const prevPosition = selectionRef.current;
    const nextPosition = getCursorPosition(textareaRef.current)!!;
    selectionRef.current = nextPosition;
    emitNoteChange({
      id: uuid.v4(),
      userId,
      noteId: currentNoteId,
      ...calculateDiff(valueRef.current, nextValue, prevPosition, nextPosition),
    });
  }, [emitNoteChange, userId]);

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
      </NoteHeader>
      {currentNoteId && <NoteTextarea ref={textareaRef} value={value} onChange={handleChange} />}
    </NoteTextareaContainer>
  );
};
