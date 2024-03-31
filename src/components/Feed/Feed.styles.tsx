import styled from '@emotion/styled';

export const FeedListWrapper = styled.div`
    width: 600px;

    @media (max-width: 480px) {
        width: 100vw;
    }
`;
export const FeedListElWrapper = styled.div`
    & > a > img {
        width: 600px;
    }

    @media (max-width: 480px) {
        & > a > img {
            width: 100vw;
        }
    }
`;
