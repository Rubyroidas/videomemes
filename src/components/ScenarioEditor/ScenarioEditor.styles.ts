import styled from '@emotion/styled';

export const ScenarioItemWrapper = styled.div<{isDragging: boolean}>`
    display: grid;
    background: ${props => props.isDragging ? 'rgba(0, 0, 0, 0.3)' : ''};
    grid-template-areas:
"dragger snapshot collectionname"
"dragger snapshot cliptitle"
"dragger snapshot usertext"
"dragger snapshot usertext";
    grid-template-columns: 40px 200px 1fr;
    user-select: none;
    width: 600px;
    margin: 0 0 16px;

    @media (max-width: 480px) {
        grid-template-columns: 10vw 1fr;
        grid-template-areas:
"dragger snapshot"
"dragger collectionname"
"dragger cliptitle"
"dragger usertext";
        width: 100%;
        margin: 0 0 2vw;
    }
`;

export const ScenarioItemButton = styled.button`
    background: none;
    border: none;
    cursor: pointer;
`;

export const SnapshotPreview = styled.div`
    grid-area: snapshot;
    
    & > div {
        position: relative;
        & > img {
            width: 100%;
        }

        & > label {
            position: absolute;
            right: 8px;
            bottom: 8px;
            padding: 4px 6px;
            background: rgba(0, 0, 0, 0.75);
            color: #fff;

            @media (max-width: 480px) {
                right: 2vw;
                bottom: 2vw;
                padding: 2vw 1.5vw;
            }
        }
    }
`;

export const ScenarioItem = styled.div`
    margin: 0 0 8px 0;

    & > label {
        background: #cece7e;
        color: #113b62;
        display: inline-block;
        padding: 4px;
        margin-right: 8px;
        font-weight: bold;
    }

    @media (max-width: 480px) {
        margin: 0 0 2vw 0;

        & > label {
            padding: 1vw;
            margin-right: 2vw;
        }
    }
`;

export const ScenarioItemCollectionName = styled(ScenarioItem)`
    grid-area: collectionname;
`;
export const ScenarioItemClipTitle = styled(ScenarioItem)`
    grid-area: cliptitle;
`;
export const ScenarioItemUserText = styled(ScenarioItem)`
    grid-area: usertext;
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
    padding: 16px;
`;
