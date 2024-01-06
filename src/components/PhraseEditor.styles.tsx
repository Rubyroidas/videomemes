import styled from '@emotion/styled';
import {css} from '@emotion/css';

import {Rect, Size} from '../types';
import {LINE_HEIGHT, TEXT_COLOR} from '../config';

export const Header = styled.div`
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
`;
export const TextAreaClass = (fontSizeDesktop: number, fontSizeMobile: number, paddingDesktop: number, paddingMobile: number, placeHolder: string) => css`
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
  
  @media (max-width: 480px) {
    font-size: ${fontSizeMobile}vw;
    padding: ${paddingMobile}vw;
  }

  &:empty::before {
    content: "${placeHolder}";
    font-style: italic;
    color: gray;
  }
`;
export const Video = styled.video`
  width: 100%;
`;
export const NavigateCaption = styled.div`
  font-size: 2rem;
  text-align: center;

  @media (max-width: 480px) {
    font-size: 4vw;
  }
`;
export const NavigatePosition = styled.div`
  display: inline-block;
  font-size: 3rem;

  @media (max-width: 480px) {
    font-size: 10vw;
  }
`;
export const NavigateButton = styled.div`
  display: inline-block;
  font-size: 3rem;

  @media (max-width: 480px) {
    font-size: 10vw;
  }
`;
