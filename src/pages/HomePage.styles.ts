import styled from '@emotion/styled';
import {Link} from 'react-router-dom';

export const Header = styled.div`
    font-size: 36px;
    font-weight: bold;
    color: var(--text-color);
    text-align: center;
    margin: 42px 0;

    @media (max-width: 480px) {
        font-size: 9vw;
        margin: 10vw 0;
    }
`;
export const Paragraph = styled.p`
    font-size: 24px;
    color: var(--text-color);
    text-align: center;
    margin: 0 75px;

    @media (max-width: 480px) {
        font-size: 6vw;
        margin: 0 18vw;
    }
`;
export const LinksList = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;
export const Button = styled(Link)`
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    
    background-color: #28A745;
    border-radius: 8px;
    color: #fff;
    text-decoration: none;
    font-size: 24px;
    font-weight: bold;
    
    box-sizing: border-box;
    width: 300px;
    padding: 10px 20px;
    margin: 15px 0;

    @media (max-width: 480px) {
        font-size: 6vw;
        width: 70vw;
        padding: 3vw 5vw;
        border-radius: 2vw;
        margin: 4vw 0;
    }
`;
export const MinorLink = styled(Link)`
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;

    background-color: transparent;
    color: var(--text-color);
    text-decoration: underline;
    font-size: 24px;
    font-weight: normal;

    box-sizing: border-box;
    width: 300px;
    padding: 10px 20px;
    margin: 7px 0;

    @media (max-width: 480px) {
        font-size: 6vw;
        width: 70vw;
        padding: 1vw 2vw;
        margin: 2vw 0;
    }
`;
