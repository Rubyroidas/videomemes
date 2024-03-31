import styled from '@emotion/styled';

export const ScenarioPickerWrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 600px;
    box-sizing: border-box;

    @media (max-width: 480px) {
        width: 100vw;
    }
`;
export const PresetWrapper = styled.div`
    margin: 0 0 8px 0;
    background-color: var(--button-bg-color);
    color: var(--button-text-color);
    cursor: pointer;

    @media (max-width: 480px) {
        margin: 0 0 2vw 0;
    }
`;
export const PresetSnapshotImage = styled.img`
    width: 100%;
`;
