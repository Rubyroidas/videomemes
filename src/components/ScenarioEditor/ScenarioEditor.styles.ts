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
