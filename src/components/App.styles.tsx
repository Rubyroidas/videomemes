import styled from '@emotion/styled';
import {Link} from 'react-router-dom';

export const AppTitle = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    font-size: 1.5rem;
    color: #DEDEDE;
    background-color: #343434;
    --button-size: 34px;

    & > a > svg {
        width: var(--button-size);
        height: var(--button-size);
        fill: #DEDEDE;
        margin: 2px 8px;
    }

    @media (max-width: 480px) {
        --button-size: 8vw;
        & > a > svg {
            margin: 0.25vw 1vw;
        }
    }
`;

export const BasicLink = styled(Link)`
    color: var(--text-color);
    text-decoration: underline;
`;

export const Button = styled.div<{disabled?: boolean}>`
    display: inline-flex;
    align-items: center;
    background-color: var(--button-bg-color);
    color: var(--button-text-color);
    padding: 8px 16px;
    margin: 0 8px 0 0;
    font-family: sans-serif;
    font-size: 24px;
    cursor: pointer;
    opacity: ${props => props.disabled ? '0.5' : '1'};
    user-select: none;
    --button-size: 40px;
    border-radius: 8px;

    & > div {
        margin-right: 12px;
    }

    & > svg {
        width: var(--button-size);
        height: var(--button-size);
        fill: var(--button-text-color);
    }

    @media (max-width: 480px) {
        --button-size: 8vw;
        border-radius: 2vw;
    }
`;
export const FloatingButton = styled.div`
    position: fixed;
    left: 530px;
    bottom: 16px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    pointer-events: auto;
    
    & > svg {
        flex: 1 1 auto;
        display: inline-block;
        width: 60px;
        height: 60px;
        fill: var(--text-color);
    }

    @media (max-width: 480px) {
        left: auto;
        right: 4vw;
        bottom: 4vw;

        & > svg {
            width: 14vw;
            height: 14vw;
        }
    }
`;

export const ListTitle = styled.div`
    margin: 16px 0;
    padding: 0 8px;
    font-weight: bold;
    font-size: 1.25rem;

    @media (max-width: 480px) {
        margin: 4vw 0;
        padding: 0 2vw;
    }
`;
export const ListDescription = styled.div`
    padding: 8px;
    
    & > svg {
        fill: var(--text-color);
        width: 32px;
        height: 32px;
    }
    
    @media (max-width: 480px) {
        padding: 2vw;

        & > svg {
            width: 8vw;
            height: 8vw;
        }
    }
`;
