import {FC} from 'react';
import styled from '@emotion/styled';

import {ArrowLeft} from '../icons/ArrowLeft';
import {ArrowRight} from '../icons/ArrowRight';
import {Icon} from './PhraseEditor.styles';

type Props = {
    canGoLeft: boolean;
    canGoRight: boolean;
    page: number;
    totalPages: number;
    setIndex: (callback: (v: number) => number) => void;
}

const NavigatePosition = styled.div`
    display: inline-block;
    font-size: 3rem;

    @media (max-width: 480px) {
        font-size: 10vw;
    }
`;
const NavigateButton = styled.div`
    display: inline-block;
    font-size: 3rem;
    cursor: pointer;
    user-select: none;

    @media (max-width: 480px) {
        font-size: 10vw;
    }
`;

const Wrapper = styled.div`
    width: 720px;

    @media (max-width: 480px) {
        width: 100vw;
    }
`;
export const NavigationBar: FC<Props> = ({canGoLeft, canGoRight, page, totalPages, setIndex}) => (
    <Wrapper>
        {canGoLeft && (
            <NavigateButton onClick={() => setIndex(i => i - 1)}>
                <Icon>
                    <ArrowLeft/>
                </Icon>
            </NavigateButton>
        )}
        <NavigatePosition style={{color: '#888'}}>{page} / {totalPages}</NavigatePosition>
        {canGoRight && (
            <NavigateButton onClick={() => setIndex(i => i + 1)}>
                <Icon>
                    <ArrowRight/>
                </Icon>
            </NavigateButton>
        )}
    </Wrapper>
);
