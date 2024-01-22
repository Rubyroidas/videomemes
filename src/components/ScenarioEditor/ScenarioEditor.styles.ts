import styled from '@emotion/styled';

export const ScenarioItemWrapper = styled.div`
    display: grid;
    grid-template-areas:
"dragger index snapshot collectionname"
"dragger index snapshot cliptitle"
"dragger index snapshot usertext"
"dragger index snapshot usertext";
    grid-template-columns: 40px 40px 200px 1fr;
    user-select: none;
    width: 600px;
    margin: 0 0 16px;
`;

export const ScenarioItemButton = styled.button`
    background: none;
    border: none;
    cursor: pointer;
`;

export const ScenarioItemDragger = styled.button`
    background: none;
    border: none;
    cursor: ns-resize;
    
    & > svg {
        width: 40px;
        height: 40px;
        stroke: var(--button-text-color);
        fill: none;
    }
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
        }
    }
`;
export const IndexColumn = styled.div`
    grid-area: index;
    width: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    
    color: yellow;
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
