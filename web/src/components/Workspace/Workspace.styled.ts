import styled from 'styled-components';
import { md } from 'global/deviceWidths';

export const Workspace = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: stretch;
    height: min(80vh, 900px);
    overflow: hidden;

    border-radius: 0.25rem;

    background-color: var(--main-bg-color);
    box-shadow: var(--material-box-shadow);

    @media (max-width: ${md}px) {
        width: 100%;
        height: 100vh;

        border-radius: 0;

        box-shadow: none;
    }

    //noinspection CssInvalidPropertyValue
    @supports (-webkit-touch-callout: none) {
        @media (max-width: ${md}px) {
            height: -webkit-fill-available;
        }
    }
`;
