import styled from 'styled-components';
import { lighten } from 'polished';
import { primaryColor } from 'global/colors';

export const NoteRowTitle = styled.div<{ $untitled: boolean }>`
  flex: 1 1 auto;

  color: ${({ $untitled }) => $untitled ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.6)'};

  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

export const NoteRowShare = styled.div`
  flex: 0 0 24px;
`;

const lightPrimary = lighten(0.3, primaryColor);

export const NoteRow = styled.div<{ selected: boolean }>`
  padding: 4px 16px 4px 24px;
  display: flex;
  flex-direction: row;
  gap: 8px;
  align-items: center;
  font-size: 14px;
  background-color: ${({ selected }) => selected ? lightPrimary : 'transparent'};
  cursor: pointer;
  line-height: 20px;

  &:hover > * {
    display: block;
  }

  &:hover {
    background-color: ${lightPrimary};
  }
`;
