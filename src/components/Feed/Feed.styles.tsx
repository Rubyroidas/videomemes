import styled from '@emotion/styled';

export const FeedListWrapper = styled.div`
    width: min(600px, 100vw);

    @media (max-width: 480px) {
        width: 100vw;
    }
`;
export const FeedListElWrapper = styled.div`
    position: relative;
    
    & > a > img {
        width: 600px;
    }

    @media (max-width: 480px) {
        & > a > img {
            width: 100vw;
        }
    }
`;
export const FeedListDuration = styled.div`
    position: absolute;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.75);
    padding: 8px;
    display: inline-flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;

    @media (max-width: 480px) {
        & > a > img {
            padding: 2vw;
        }
    }
`;
