import {FC} from 'react';
import styled from '@emotion/styled';

import {TextSize} from '../types';

export const AppTitle = styled.div`
    font-size: 2rem;
`;

export const Button = styled.div`
  display: inline-flex;
    align-items: center;
  background-color: black;
  color: white;
  padding: 8px 16px;
  margin: 0 8px 0 0;
  font-family: sans-serif;
  font-size: 24px;
  cursor: pointer;
    
    & > div {
        margin-right: 12px;
    }
`;
export const ButtonSelectorWrapper = styled.div`
    display: flex;
    flex-direction: row;
`;
export const ButtonSelectorCaption = styled.div`
    display: flex;
    flex-direction: row;
`;
export const ButtonSelectorItem = styled.div<{selected: boolean}>`
    display: inline-block;
    background-color: ${props => props.selected ? '#888' : '#444'};
    color: #fff;
    padding: 8px 12px;
    margin: 0 4px;
    cursor: pointer;
`;
type ButtonSelectorProps = {
    caption: string;
    value: TextSize;
    values: {
        value: TextSize,
        text: string,
    }[];
    onChange: (value: TextSize) => void;
}
export const ButtonSelector: FC<ButtonSelectorProps> = ({caption, value, values, onChange}) => (
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
