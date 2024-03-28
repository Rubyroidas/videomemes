import styled from '@emotion/styled';
import {css} from '@emotion/css';

import {Point, Rect, Size} from '../../types';
import {LINE_HEIGHT, TEXT_COLOR} from '../../config';

export const Header = styled.div`
`;
export const PhraserEditorWrapper = styled.div<Size>`
    width: ${props => props.width}px;
    height: ${props => props.height}px;
    position: relative;

    @media (max-width: 480px) {
        width: 100vw;
        height: ${props => props.height / props.width * 100}vw;
    }
`;
export const EditingAreaContainer = styled.div<Size>`
    width: ${props => props.width}px;
    height: ${props => props.height}px;
    position: relative;

    @media (max-width: 480px) {
        width: 100vw;
        height: ${props => props.height / props.width * 100}vw;
    }
`;
export const InputBackground = styled.div<Rect>`
    position: absolute;
    left: ${props => props.x}%;
    top: ${props => props.y}%;
    width: ${props => props.width}%;
    height: ${props => props.height}%;
    background-color: #fff;
    z-index: 1;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center center;
`;
export const TextAreaClass = (fontSizeDesktop: number, fontSizeMobile: number, paddingDesktop: number, paddingMobile: number) => css`
    position: absolute;
    width: 100%;
    height: 100%;

    background-color: transparent;
    color: ${TEXT_COLOR};
    font-family: sans-serif;
    line-height: ${LINE_HEIGHT * 100}%;
    font-weight: bold;
    font-size: ${fontSizeDesktop}px;
    text-align: center;
    display: grid;
    justify-content: center;
    align-items: center;
    align-content: center;

    box-sizing: border-box;
    padding: ${paddingDesktop}px;

    border: none;
    outline: none;
    overflow: hidden;
    resize: none;
    
    & div::before {
        content: "";
        color: ${TEXT_COLOR};
        line-height: ${LINE_HEIGHT * 100}%;
        font-weight: bold;
        display: block;
        width: 1px;
        height: 1px;
    }

    @media (max-width: 480px) {
        font-size: ${fontSizeMobile}vw;
        padding: ${paddingMobile}vw;
    }
`;
export const FileDropArea = styled.div`
    position: absolute;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: flex-start;
    justify-content: flex-end;
    cursor: pointer;
    
    & > div {
        box-sizing: border-box;
        background-color: rgba(0, 0, 0, 0.75);
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 8px;
        border-radius: 0 0 0 12px;
    }

    &.big {
        align-items: center;
        justify-content: center;
        background-color: rgba(0, 0, 0, 0.75);
    }
    &.big > div {
        width: 100%;
        height: 100%;
        background-color: transparent;
    }

    /* duplicating for non-mobile to appear on hover */
    @media (hover: hover) {
        &:hover {
            align-items: center;
            justify-content: center;
            background-color: rgba(0, 0, 0, 0.75);
        }
        &:hover > div {
            width: 100%;
            height: 100%;
            background-color: transparent;
        }
    }
`;
export const EditingVideo = styled.video`
    width: 100%;
`;
export const NavigateCaption = styled.div`
    font-size: 2rem;
    text-align: center;
    width: 720px;

    @media (max-width: 480px) {
        font-size: 4vw;
        width: 100vw;
    }
`;
export const Icon = styled.div`
    display: inline-block;
    width: 48px;
    height: 48px;
    color: var(--button-text-color);

    & > svg {
        width: 100%;
        height: 100%;
        fill: var(--button-text-color);
        stroke: none;
    }

    & > svg.stroked {
        fill: none;
        stroke: var(--button-text-color);
    }

    @media (max-width: 480px) {
        width: 12vw;
        height: 12vw;
    }
`;

type PlayButtonProps = {
    position: Point;
    visible: boolean;
}
export const PlayButton = styled.div<PlayButtonProps>`
    position: absolute;
    background: rgba(0, 0, 0, 0.25);
    left: ${props => props.position.x}%;
    top: ${props => props.position.y}%;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
    translate: -50% -50%;
    --button-size: 100px;
    border-radius: calc(var(--button-size) * 0.4);
    padding: calc(var(--button-size) * 0.2);
    opacity: ${props => props.visible ? '1' : '0'};
    transition: opacity 150ms linear;
    
    & > svg {
        width: var(--button-size);
        height: var(--button-size);
        fill: #fff;
    }

    @media (max-width: 480px) {
        --button-size: 20vw;
    }
`;
export const ResultVideo = styled.video`
    @media (max-width: 480px) {
        width: 100vw;
    }
`;
