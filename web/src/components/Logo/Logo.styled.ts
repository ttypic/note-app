import styled from 'styled-components';
import { primaryColor } from 'global/colors';

export const Logo = styled.div<{ size: number }>`
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;

  &::after {
    content: 'N';
    position: relative;
    top: 50%;
    left: 50%;
    margin-left: -${({ size }) => size / 2}px;
    margin-top: -${({ size }) => size / 2}px;
    display: block;
    width: ${({ size }) => size}px;
    height: ${({ size }) => size}px;
    font-size: ${({ size }) => size / 2}px;
    font-weight: bold;
    font-family: monospace;
    text-transform: uppercase;
    text-align: center;
    line-height: ${({ size }) => size}px;
    color: white;
    border: none;
    border-radius: 50%;
    background: ${primaryColor};
`;
