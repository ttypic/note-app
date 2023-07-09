import styled from 'styled-components';
import { md, sm } from 'global/deviceWidths';
import { UnstyledButton } from '../../components/Button';

export const NoteTextareaContainer = styled.div`
  position: relative;

  display: flex;
  flex: 0 0 auto;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  box-sizing: border-box;
  width: 792px;

  @media (max-width: ${md}px) {
    & {
      width: calc(100% - 220px);
    }
  }

  @media (max-width: ${sm}px) {
    & {
      width: 100%;
    }
  }
`;

export const NoteTextarea = styled.textarea`
  flex: 1 0 auto;
  border: none;
  outline: none;
  resize: none;
  padding: 8px;
`;

export const NoteHeader = styled.div`
  display: none;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 8px 8px;

  @media (max-width: ${sm}px) {
    & {
      display: flex;
    }
  }
`;

export const BackButton = styled(UnstyledButton)`
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;
`;
