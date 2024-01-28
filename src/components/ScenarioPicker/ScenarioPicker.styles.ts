import styled from '@emotion/styled';

export const ScenarioPickerWrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 600px;

    @media (max-width: 480px) {
        width: 100vw;
    }
`;
export const PresetWrapper = styled.div`
    margin: 8px 0;
    background-color: var(--button-bg-color);
    color: var(--button-text-color);
    padding: 16px;

    @media (max-width: 480px) {
        padding: 4vw;
    }
`;
