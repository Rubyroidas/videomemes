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
