import styled from '@emotion/styled';
import clsx from 'clsx';

export const ButtonSelectorWrapper = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
`;
export const ButtonSelectorCaption = styled.div`
    display: flex;
    flex-direction: row;
    font-weight: bold;
    margin: 8px 12px;

    @media (max-width: 480px) {
        margin: 2vw 3vw;
    }
`;
export const ButtonSelectorItem = styled.div`
    display: inline-block;
    background-color: var(--switch-button-bg-color);
    color: #fff;
    padding: 8px 12px;
    margin: 0;
    cursor: pointer;
    user-select: none;
    outline: none;
    text-align: center;

    &.selected {
        background-color: var(--switch-button-bg-color-selected);
    }

    @media (max-width: 480px) {
        padding: 2vw 3vw;
    }
`;
export type ButtonSelectorValue<T> = {
    value: T,
    text: string,
};
type ButtonSelectorProps<T> = {
    caption: string;
    value: T;
    values: ButtonSelectorValue<T>[];
    onChange: (value: T) => void;
}
export const ButtonSelector = <T extends string | number>({caption, value, values, onChange}: ButtonSelectorProps<T>) => (
    <ButtonSelectorWrapper>
        <ButtonSelectorCaption>{caption}</ButtonSelectorCaption>
        {values.map(item => (
            <ButtonSelectorItem
                key={item.value}
                className={clsx({selected: item.value === value})}
                onClick={() => onChange(item.value)}
            >
                {item.text}
            </ButtonSelectorItem>
        ))}
    </ButtonSelectorWrapper>
);
