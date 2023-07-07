import styled, { keyframes } from 'styled-components';

export const ButtonLayout = styled.button`
  text-transform: uppercase;
  outline: 0;
  background: #4CAF50;
  width: 100%;
  border: 0;
  border-radius: 8px;
  padding: 16px;
  color: #FFFFFF;
  font-size: 16px;
  line-height: 22px;
  transition: all 0.3s ease;
  cursor: pointer;
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
  border-radius: 16px;
  background: #75d279;
  animation: ${flickerAnimation} 1s infinite;
`;
