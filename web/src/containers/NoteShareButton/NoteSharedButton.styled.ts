import styled from 'styled-components';
import { UnstyledButton } from 'components/Button';

export const ShareButton = styled(UnstyledButton)`
  & > svg {
    color: rgba(0, 0, 0, 0.6);
    width: 16px;
    height: 16px;
  }
`;
