import styled from 'styled-components';
import { sm } from 'global/deviceWidths';
import { mainBgColor } from 'global/colors';
import { NAVIGATION_ZI } from 'global/zIndex';

export const LeftPanel = styled.div<{ open: boolean }>`
  left: 0;

  display: flex;
  flex: 0 0 auto;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  box-sizing: border-box;
  width: 220px;

  border-right: 1px solid rgba(0, 0, 0, 0.12);

  @media (max-width: ${sm}px) {
    position: fixed;
    top: 0;

    width: 100vw;
    height: 100vh;

    left: ${({ open }) => (open ? '0' : '-100vw')};
    z-index: ${NAVIGATION_ZI};

    background-color: ${mainBgColor};
    transition: ${({ open }) => (open ? 'left 0.3s ease-in-out' : 'none')};
  }

  @supports (-webkit-touch-callout: none) {
    //noinspection ALL
    @media (max-width: ${sm}px) {
      height: -webkit-fill-available;
    }
  }
`;

export const Flex = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  padding: 0 16px;
`;

export const Spacer = styled.div<{ height: number }>`
  display: block;
  width: 1px;
  height: ${({ height }) => height}px;
`;
