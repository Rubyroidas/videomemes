import styled from '@emotion/styled';

export const ScenarioItemWrapper = styled.div`
    user-select: none;
    width: 600px;
    height: 337.5px;
    margin: 0 0 16px;
    font-size: 17px;
    position: relative;
    color: #fff;
    
    &.isDragging {
        background: rgba(0, 0, 255, 0.3);
    }
    
    &.disabled {
        opacity: 0.5;
    }

    @media (max-width: 480px) {
        font-size: 4vw;
        line-height: 8vw;
        width: 100vw;
        height: 56.25vw;
        margin: 0 0 2vw;
    }
`;

export const ScenarioItemWrapperGrid = styled.div`
    position: absolute;
    left: 0;
    top: 0;
    display: grid;
    grid-template-areas:
"index cliptitle close"
"empty empty empty"
"usertext usertext duration";
    grid-template-columns: 52px 1fr 52px;
    grid-template-rows: 34px 1fr 34px;
    width: 100%;
    height: 100%;
    pointer-events: none;

    @media (max-width: 480px) {
        grid-template-columns: 12vw 1fr 12vw;
        grid-template-rows: 8vw 1fr 8vw;
    }
`;

export const ScenarioItemIndexNumber = styled.div`
    grid-area: index;
    background: rgba(0, 0, 0, 0.75);
    border-right: solid 1px #fff;
    box-sizing: border-box;
    text-align: center;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
`;
export const ScenarioItemUserText = styled.div`
    grid-area: usertext;
    background: rgba(0, 0, 0, 0.75);
    box-sizing: border-box;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    padding: 0 10px;
    display: flex;
    flex-direction: row;
    align-items: center;

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
    display: flex;
    flex-direction: row;
    align-items: center;

    @media (max-width: 480px) {
        padding: 0 2.5vw;
    }
`;
export const ScenarioItemDeleteButton = styled.div`
    background: none;
    border: none;
    cursor: pointer;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    pointer-events: auto;
    
    & > svg {
        display: inline-block;
        flex: 1 1 auto;
        width: 32px;
        height: 32px;
        fill: #fff;
    }

    @media (max-width: 480px) {
        & > svg {
            width: 10vw;
            height: 10vw;
        }
    }
`;
export const ScenarioItemDuration = styled.div`
    grid-area: duration;
    background: rgba(0, 0, 0, 0.75);
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;

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
    width: 600px;
    height: 337.5px;
    
    & > img {
        width: 100%;
        height: 100%;
    }
    
    & > .name {
        color: #fff;
        font-size: 1.5em;
        font-weight: bold;
        position: absolute;
        left: 0;
        top: 0;
        display: inline-block;
        background: rgba(0, 0, 0, 0.5);
        padding: 4px 8px;
    }
    
    & > .videos-count {
        color: #fff;
        font-size: 1.25em;
        position: absolute;
        right: 0;
        top: 0;
        display: inline-block;
        background: rgba(0, 0, 0, 0.5);
        padding: 4px 8px;
    }

    @media (max-width: 480px) {
        width: 100vw;
        height: 56.25vw;

        & > img {
            width: 100vw;
            height: 56.25vw;
        }

        & > .name {
            padding: 1vw 2vw;
        }
    }
`;
