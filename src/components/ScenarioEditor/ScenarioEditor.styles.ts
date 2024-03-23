import styled from '@emotion/styled';

export const ScenarioItemWrapper = styled.div`
    display: grid;
    grid-template-areas:
"index cliptitle close"
"empty empty empty"
"usertext usertext duration";
    grid-template-columns: 52px 1fr 52px;
    grid-template-rows: 34px 1fr 34px;
    user-select: none;
    width: 600px;
    height: 337.5px;
    margin: 0 0 16px;
    font-size: 17px;
    cursor: pointer;
    position: relative;
    
    &.isDragging {
        background: rgba(0, 0, 0, 0.3);
    }
    
    &.disabled {
        opacity: 0.5;
    }

    @media (max-width: 480px) {
        grid-template-columns: 12vw 1fr 12vw;
        grid-template-rows: 8vw 1fr 8vw;
        font-size: 4vw;
        line-height: 8vw;
        width: 100vw;
        height: 56.25vw;
        margin: 0 0 2vw;
    }
`;

export const SnapshotPreview = styled.div`
    grid-column: 1 / 4;
    grid-row: 1 / 4;
    position: absolute;
    z-index: -1;
    width: 100%;
    height: 100%;
    
    & > img {
        width: 100%;
    }
`;
export const ScenarioItemIndexNumber = styled.div`
    grid-area: index;
    background: rgba(0, 0, 0, 0.75);
    border-right: solid 1px #fff;
    box-sizing: border-box;
    text-align: center;
`;
export const ScenarioItemUserText = styled.div`
    grid-area: usertext;
    background: rgba(0, 0, 0, 0.75);
    box-sizing: border-box;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    padding: 0 10px;

    @media (max-width: 480px) {
        padding: 0 2.5vw;
    }
`;
export const ScenarioItemClipTitle = styled.div`
    grid-area: cliptitle;
    background: linear-gradient(to right, rgba(0, 0, 0, 0.75), transparent);
    box-sizing: border-box;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    padding: 0 10px;

    @media (max-width: 480px) {
        padding: 0 2.5vw;
    }
`;
export const ScenarioItemDeleteButton = styled.button`
    background: none;
    border: none;
    cursor: pointer;
`;
export const ScenarioItemDuration = styled.div`
    grid-area: duration;
    background: rgba(0, 0, 0, 0.75);
    color: #fff;
    text-align: center;

    @media (max-width: 480px) {
        right: 2vw;
        bottom: 2vw;
    }
`;

export const AddPhraseCollectionList = styled.div`
    width: 600px;

    @media (max-width: 480px) {
        width: 100vw;
    }
`;
export const AddPhraseCollectionItemList = styled.div`
    width: 600px;

    @media (max-width: 480px) {
        width: 100vw;
    }
`;
export const CollectionElement = styled.div`
    cursor: pointer;
    background: transparent center/contain no-repeat;
    position: relative;
    
    & > img {
        width: 320px;
        height: 180px;
    }
    
    & > .name {
        font-size: 1.5em;
        font-weight: bold;
        position: absolute;
        left: 0;
        top: 0;
        display: inline-block;
        background: rgba(0, 0, 0, 0.5);
        padding: 4px 8px;
    }

    @media (max-width: 480px) {
        width: 100vw;

        & > img {
            width: 100vw;
            height: 56.25vw;
        }

        & > .name {
            padding: 1vw 2vw;
        }
    }
`;
