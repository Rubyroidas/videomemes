import styled from '@emotion/styled';

export const ScenarioItemWrapper = styled.div`
    display: flex;
    flex-direction: row;
    user-select: none;
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
    width: 200px;
    
    & > img {
        width: 100%;
    }
`;
export const IndexColumn = styled.div`
    width: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    
    color: yellow;
`;

export const ScenarioItemTexts = styled.div`
    display: flex;
    flex-direction: column;
`;
