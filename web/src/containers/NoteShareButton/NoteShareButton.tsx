import React, { useCallback } from 'react';
import { useHttpCall } from 'utils/useHttpCall';
import { ShareIcon } from 'components/Icon';
import { ShareButton } from './NoteSharedButton.styled';

interface NoteShareButtonProps {
  accessToken: string;
  noteId: string;
}

interface ShareRequest {
  noteId: string;
  sharedWith: string;
}

export const NoteShareButton: React.FC<NoteShareButtonProps> = ({ accessToken, noteId }) => {
  const { makeCall } = useHttpCall<{}, ShareRequest>({ method: 'POST', path: 'share', accessToken });

  const handleShare = useCallback(() => {
    const sharedWith = prompt('With whom do you want to share?');
    if (!sharedWith) return;
    return makeCall({
      body: { noteId, sharedWith },
    });
  }, [noteId, makeCall]);

  return (
    <ShareButton onClick={handleShare} title='Share note'>
      <ShareIcon />
    </ShareButton>
  );
};
