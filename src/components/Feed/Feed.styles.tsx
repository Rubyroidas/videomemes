import styled from '@emotion/styled';

export const FeedListWrapper = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: flex-start;

    @media (max-width: 480px) {
        flex-direction: column;
        flex-wrap: nowrap;
    }
`;
export const FeedListElWrapper = styled.div`
    position: relative;
    margin: 4px;
    
    & > a > img {
        width: 600px;
    }

    @media (max-width: 480px) {
        margin: 2vw 0 0 0;
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
