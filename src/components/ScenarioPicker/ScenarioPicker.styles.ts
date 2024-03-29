import styled from '@emotion/styled';

export const ScenarioPickerWrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 600px;
    box-sizing: border-box;
    padding: 8px;

    @media (max-width: 480px) {
        width: 100vw;
        padding: 2vw;
    }
`;
export const PresetWrapper = styled.div`
    margin: 0 0 8px 0;
    background-color: var(--button-bg-color);
    color: var(--button-text-color);
    padding: 16px;
    cursor: pointer;

    @media (max-width: 480px) {
        padding: 4vw;
        margin: 0 0 2vw 0;
    }
`;
