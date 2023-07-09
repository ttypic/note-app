import styled, { keyframes } from 'styled-components';
import { primaryColor } from 'global/colors';
import { lighten } from 'polished';

export const ButtonLayout = styled.button`
  text-transform: uppercase;
  outline: 0;
  background: ${primaryColor};
  width: 100%;
  border: 0;
  border-radius: 8px;
  padding: 16px;
  color: #fff;
  font-size: 16px;
  line-height: 22px;
  transition: all 0.3s ease;
  cursor: pointer;

  &[disabled] {
    pointer-events: none;
    opacity: 0.6;
  }
`;

const flickerAnimation = keyframes`
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
`;

export const Placeholder = styled.div`
  width: 100%;
  height: 22px;
  border-radius: 8px;
  background: ${lighten(0.1, primaryColor)};
  animation: ${flickerAnimation} 1s infinite;
`;

export const UnstyledButton = styled.button`
  display: block;
  border: none;
  outline: none;
  padding: 0;
  background-color: transparent;
  text-align: left;
  cursor: pointer;

  &[disabled] {
    pointer-events: none;
    opacity: 0.6;
  }
`;
