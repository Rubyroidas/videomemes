import styled from '@emotion/styled';
import {Link} from 'react-router-dom';

export const AppTitle = styled.div`
    font-size: 2rem;
`;

export const BasicLink = styled(Link)`
    color: var(--text-color);
    text-decoration: underline;
`;

export const Button = styled.div<{disabled?: boolean}>`
    display: inline-flex;
    align-items: center;
    background-color: var(--button-bg-color);
    color: var(--button-text-color);
    padding: 8px 16px;
    margin: 0 8px 0 0;
    font-family: sans-serif;
    font-size: 24px;
    cursor: pointer;
    opacity: ${props => props.disabled ? '0.5' : '1'};
    user-select: none;

    & > div {
        margin-right: 12px;
    }
`;
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
`;
export const ButtonSelectorItem = styled.div<{selected: boolean}>`
    display: inline-block;
    background-color: ${props => props.selected ? '#888' : '#444'};
    color: #fff;
    padding: 8px 12px;
    margin: 0 4px;
    cursor: pointer;
`;
type ButtonSelectorProps<T> = {
    caption: string;
    value: T;
    values: {
        value: T,
        text: string,
    }[];
    onChange: (value: T) => void;
}
export const ButtonSelector = <T extends string | number>({caption, value, values, onChange}: ButtonSelectorProps<T>) => (
    <ButtonSelectorWrapper>
        <ButtonSelectorCaption>{caption}</ButtonSelectorCaption>
        {values.map(item => (
            <ButtonSelectorItem
                key={item.value}
                selected={item.value === value}
                onClick={() => onChange(item.value)}
            >
                {item.text}
            </ButtonSelectorItem>
        ))}
    </ButtonSelectorWrapper>
)
