import styled from '@emotion/styled';

import {LoadingSpinner} from '../../icons/LoadingSpinner';

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
    width: 200px;

    @media (max-width: 480px) {
        width: 46vw;
    }
`;

export const ProgressCurtain = () => (
    <Wrapper>
        <LoadingSpinner/>
        <SpinnerText>
            Generating your video... That can take up to several minutes
        </SpinnerText>
    </Wrapper>
);
