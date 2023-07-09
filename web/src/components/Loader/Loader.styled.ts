import styled, { keyframes } from 'styled-components';
import { rgba } from 'polished';
import { primaryColor } from 'global/colors';

const pulse = keyframes`
  0% {
    transform: scale(.9);
  }
  70% {
    transform: scale(1);
    box-shadow: 0 0 0 50px ${rgba(primaryColor, 0)};
  }
  100% {
    transform: scale(.9);
    box-shadow: 0 0 0 0 ${rgba(primaryColor, 0)};
  }
`;

export const Loader = styled.div`
  width: 200px;
  height: 200px;
  margin: 0 auto 0;
  -webkit-backface-visibility: hidden;

  &::after {
    content: 'N';
    position: relative;
    top: 50%;
    left: 50%;
    margin-left: -50px;
    margin-top: -50px;
    display: block;
    width: 100px;
    height: 100px;
    font-size: 50px;
    font-weight: bold;
    font-family: monospace;
    text-transform: uppercase;
    text-align: center;
    line-height: 100px;
    color: white;
    border: none;
    border-radius: 50%;
    background: ${primaryColor};
    box-shadow: 0 0 0 0 ${rgba(primaryColor, .5)};
    animation: ${pulse} 1.5s infinite;
  }
`;
