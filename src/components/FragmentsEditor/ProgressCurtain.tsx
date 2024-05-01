import {PropsWithChildren, useEffect, useState} from 'react';
import styled from '@emotion/styled';

import {LoadingSpinner} from '../../icons/LoadingSpinner';
import {progressCurtainTexts} from '../../statics';

const Wrapper = styled.div`
    position: fixed;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.8) none;
    z-index: 10;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    svg {
        width: 200px;
        margin: 0 0 16px 0;
    }

    @media (max-width: 480px) {
        svg {
            width: 46vw;
            margin: 0 0 4vw 0;
        }
    }
    
    svg path {
        transform-origin: 50% 50%;
    }
    svg .circle-1 {
        animation: circle-1-animation 1s linear 0ms infinite normal;
    }
    svg .circle-2 {
        animation: circle-2-animation 1.3s linear 200ms infinite normal;
    }
    svg .circle-3 {
        animation: circle-4-animation 1.6s linear 400ms infinite normal;
    }
    svg .circle-4 {
        animation: circle-4-animation 1.9s linear 600ms infinite normal;
    }
    
    @keyframes circle-1-animation {
        from {rotate: 0deg;}
        to {rotate: 360deg;}
    }
    @keyframes circle-2-animation {
        from {rotate: 0deg;}
        to {rotate: 360deg;}
    }
    @keyframes circle-3-animation {
        from {rotate: 0deg;}
        to {rotate: 360deg;}
    }
    @keyframes circle-4-animation {
        from {rotate: 0deg;}
        to {rotate: 360deg;}
    }
`;

const SpinnerText = styled.div`
    text-align: center;
    width: 300px;
    line-height: 160%;
    color: #fff;

    @media (max-width: 480px) {
        width: 60vw;
    }
`;

const AnimatedText = () => {
    const [dots, setDots] = useState(0);
    const [textId, setTextId] = useState(0);

    useEffect(() => {
        setTimeout(() => {
            if (dots === 3) {
                setDots(0);
                setTextId(id => (id + 1) % progressCurtainTexts.length);
            } else {
                setDots(d => d + 1);
            }
        }, 500);
    }, [dots]);

    return (
        <SpinnerText>
            <div>{progressCurtainTexts[textId]}{'.'.repeat(dots)}</div>
            <div>That can take up to several minutes</div>
            <div>Don't close this tab</div>
        </SpinnerText>
    );
};

export const ProgressCurtain = ({children}: PropsWithChildren) => (
    <Wrapper>
        <LoadingSpinner/>
        <AnimatedText/>
        {children}
    </Wrapper>
);