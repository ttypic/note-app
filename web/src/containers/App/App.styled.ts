import styled, { createGlobalStyle } from 'styled-components';
import { normalize } from 'polished';
import { sm } from 'global/deviceWidths';

export const GlobalStyles = createGlobalStyle`
  ${normalize()}
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell',
    'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;

    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace;
  }

  :root {

    //region backgrounds
    --main-bg-color: #f6f6f6;
    --overlay-bg-color: #e5e5e5;
    --note-bg-color: #fff;
    //endregion

    //region fonts

    //endregion

    //region font colors
    --main-color: rgba(0, 0, 0, 0.4);
    //endregion

    //region shadows
    --material-box-shadow: 1px 0 6px rgba(0, 0, 0, 0.04), 1px 0 4px rgba(0, 0, 0, 0.12);
    //endregion
  }

  @media (max-width: ${sm}px) {
    :root {
    }
  }
`;

export const AppLayout = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;

  background-color: var(--overlay-bg-color);

  //noinspection CssInvalidPropertyValue
  @supports (-webkit-touch-callout: none) {
    min-height: -webkit-fill-available;
  }
`;
