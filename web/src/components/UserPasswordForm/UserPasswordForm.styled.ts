import styled from 'styled-components';
import { primaryColor } from 'global/colors';

export const Form = styled.form`
  max-width: 360px;
  padding: 40px;
`;

export const Message = styled.p`
  text-align: center;
  margin: 16px 0 0;
  color: #b3b3b3;
  font-size: 12px;
`;

export const Anchor = styled.a`
  color: ${primaryColor};
  text-decoration: none;
  cursor: pointer;
`;

export const Error = styled.p`
  text-align: center;
  margin-top: 24px;
  color: #c52323;
  font-size: 12px;
`;
