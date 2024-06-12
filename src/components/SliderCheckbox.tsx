import {HTMLAttributes} from 'react';
import styled from '@emotion/styled';

export type SliderCheckboxProps = HTMLAttributes<HTMLInputElement>;

const SliderCheckboxWrapper = styled.input`
    --size: 32px;
    width: calc(var(--size) * 2);
    height: calc(var(--size) * 1.05);
    background-color: #acacac;
    border-radius: calc(var(--size) / 2);
    position: relative;
    cursor: pointer;
    appearance: none;
    outline: none;
    border: 1px solid #D9DADC;
    transition: background-color 150ms linear;

    &:checked {
        border-color: #4ED164;
        background-color: #4e9e40;
    }

    &:after {
        pointer-events: none;
        content: "";
        display: inline-block;
        position: absolute;
        width: calc(var(--size) * 0.8);
        height: calc(var(--size) * 0.8);
        border-radius: calc(var(--size) / 2);
        background-color: #fff;
        left: calc(var(--size) / 10);
        top: calc(var(--size) / 10);
        transition: left 150ms linear;
        box-shadow: 0 0 calc(var(--size) / 10) calc(var(--size) / 10) rgba(0, 0, 0, 0.2);
    }

    &:checked:after {
        left: calc(100% - var(--size) * 0.9);
    }

    @media (max-width: 480px) {
        --size: 8vw;
    }
`;

export const SliderCheckbox = (rest: SliderCheckboxProps) => (
    <SliderCheckboxWrapper
        {...rest}
        type="checkbox"
    />
);

export type SliderCheckboxWithLabel = SliderCheckboxProps & {
    label: string;
}

const SliderCheckboxWithLabelWrapper = styled.label`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-items: flex-start;
    cursor: pointer;
`;
const SliderCheckboxLabel = styled.div`
    display: inline-block;
`;

export const SliderCheckboxWithLabel = ({label, ...rest}: SliderCheckboxWithLabel) => (
    <SliderCheckboxWithLabelWrapper>
        <SliderCheckbox {...rest} />
        <SliderCheckboxLabel>{label}</SliderCheckboxLabel>
    </SliderCheckboxWithLabelWrapper>
);
