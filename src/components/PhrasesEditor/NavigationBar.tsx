import {FC} from 'react';
import styled from '@emotion/styled';

import {ArrowLeft} from '../../icons/ArrowLeft';
import {ArrowRight} from '../../icons/ArrowRight';
import {Icon} from './PhraseEditor.styles';

type Props = {
    canGoLeft: boolean;
    canGoRight: boolean;
    page: number;
    totalPages: number;
    setIndex: (callback: (v: number) => number) => void;
}

const Wrapper = styled.div`
    display: grid;
    user-select: none;
    grid-template-columns: 48px 1fr 48px;
    padding: 8px;
    box-sizing: border-box;
    grid-template-areas:
"left text right";
    width: 720px;

    @media (max-width: 480px) {
        grid-template-columns: 12vw 1fr 12vw;
        width: 100vw;
        padding: 2vw;
    }
`;

const NavigatePosition = styled.div`
    grid-area: text;
    font-size: 3rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;

    @media (max-width: 480px) {
        font-size: 10vw;
    }
`;
const NavigateButton = styled.div`
    cursor: pointer;
`;
export const NavigationBar: FC<Props> = ({canGoLeft, canGoRight, page, totalPages, setIndex}) => (
    <Wrapper>
        {canGoLeft && (
            <NavigateButton onClick={() => setIndex(i => i - 1)} style={{gridArea: 'left'}}>
                <Icon>
                    <ArrowLeft/>
                </Icon>
            </NavigateButton>
        )}
        <NavigatePosition style={{color: '#888'}}>{page} / {totalPages}</NavigatePosition>
        {canGoRight && (
            <NavigateButton onClick={() => setIndex(i => i + 1)} style={{gridArea: 'right'}}>
                <Icon>
                    <ArrowRight/>
                </Icon>
            </NavigateButton>
        )}
    </Wrapper>
);
