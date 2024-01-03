import {ClipboardEventHandler, FC, MouseEventHandler, useState} from 'react';
import ContentEditable, {ContentEditableEvent} from 'react-contenteditable';
import styled from '@emotion/styled';
import { css } from '@emotion/css';

import {Collection, Rect, Size, UserPhrase} from '../types';
import {escapeHTML} from '../utils';
import {FONT_SIZE, TEXT_PADDING} from "../config.ts";

type PhraseEditorProps = {
    disabled: boolean;
    collections: Collection[];
    userPhrases: UserPhrase[];
    onChange: (phrases: UserPhrase[]) => void;
}
const Header = styled.div`
`;
const EditingAreaContainer = styled.div<Size>`
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  position: relative;

  @media (max-width: 480px) {
    width: 100vw;
    height: ${props => props.height / props.width * 100}vw;
  }
`;
const InputBackground = styled.div<Rect>`
  position: absolute;
  left: ${props => props.x}%;
  top: ${props => props.y}%;
  width: ${props => props.width}%;
  height: ${props => props.height}%;
  background-color: #fff;
  z-index: 1;
`;
const TextAreaClass = (fontSizeDesktop: number, fontSizeMobile: number, paddingDesktop: number, paddingMobile: number, placeHolder: string) => css`
  position: absolute;
  width: 100%;
  height: 100%;

  background-color: transparent;
  color: red;
  font-family: sans-serif;
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
const Video = styled.video`
  width: 100%;
`;

export const PhraseEditorProxy: FC<PhraseEditorProps> = (props) => {
    const {userPhrases, onChange, ...rest} = props;

    const onProxyChange = (phrases: UserPhrase[]) => {
        const escapedPhrases: UserPhrase[] = phrases.map(({text, ...ppp}) => {
            if (!text) {
                return {text, ...ppp};
            }
            const c = document.createElement('div');
            c.innerHTML = text;

            const els = c.firstChild?.constructor === Text
                ? [c.firstChild, ...c.children]
                : [...c.children];

            return ({
                ...ppp,
                text: els.map(el => el.textContent).join('\n'),
            });
        });
        onChange(escapedPhrases);
    };

    const phrases = userPhrases.map(({text, ...ppp}) => ({
        ...ppp,
        text: text
            ? text.split('\n')
            .map((line) => `<div>${escapeHTML(line)}</div>`)
            .join('')
            : undefined
    }));

    return (
        <PhraseEditor
            userPhrases={phrases}
            onChange={onProxyChange}
            {...rest}
        />
    );
};

export const PhraseEditor: FC<PhraseEditorProps> = (props) => {
    const {disabled, collections, userPhrases, onChange} = props;
    const [phraseIndex, setPhraseIndex] = useState(0);
    const handlePhraseChange = (e: ContentEditableEvent) => {
        const result = [...userPhrases];
        result[phraseIndex] = {
            ...result[phraseIndex],
            text: e.target.value,
        };
        onChange(result);
    };
    const handlePaste: ClipboardEventHandler = (e) => {
        e.preventDefault();
        document.execCommand('inserttext', false, e.clipboardData.getData('text/plain'));
    };
    const handleVideoClick: MouseEventHandler = (e) => {
        const video = e.target as HTMLVideoElement;
        if (video.paused) {
            video.play();
        } else {
            video.pause();
        }
    };

    const userPhrase = userPhrases[phraseIndex];
    const collection = collections.find(c => c.id === userPhrase.collectionId)!;
    const item = collection.items.find(item => item.id === userPhrase.phraseId)!;

    const canGoLeft = phraseIndex > 0;
    const canGoRight = phraseIndex < userPhrases.length - 1;

    const virtualRect: Rect = {
        x: collection.textArea.x / collection.size.width * 100,
        y: collection.textArea.y / collection.size.height * 100,
        width: collection.textArea.width / collection.size.width * 100,
        height: collection.textArea.height / collection.size.height * 100,
    };
    const fontSizeDesktop = FONT_SIZE * collection.size.width;
    const fontSizeMobile = FONT_SIZE * 100;
    const paddingDesktop = TEXT_PADDING * collection.size.width / 100;
    const paddingMobile = TEXT_PADDING;
    const inputClassName = TextAreaClass(fontSizeDesktop, fontSizeMobile, paddingDesktop, paddingMobile, item.name);

    return (
        <div>
            <Header>
                <div>
                    {canGoLeft && (
                        <span onClick={() => setPhraseIndex(i => i - 1)}>⬅️</span>
                    )}
                    <span>
                    <span style={{color: '#888'}}>{phraseIndex + 1} / {userPhrases.length}</span>
                </span>
                    {canGoRight && (
                        <span onClick={() => setPhraseIndex(i => i + 1)}>➡️</span>
                    )}
                </div>
                <div>
                    <b>{collection.name}</b> "{item.name}"
                </div>
            </Header>
            <EditingAreaContainer {...collection.size}>
                <InputBackground {...virtualRect}>
                    <ContentEditable
                        onPaste={handlePaste}
                        disabled={disabled}
                        className={inputClassName}
                        html={userPhrase.text!}
                        onChange={handlePhraseChange}
                    />
                </InputBackground>
                <Video
                    onClick={handleVideoClick}
                    controls={false}
                    loop={false}
                    src={item.videoFile}
                    disablePictureInPicture={true}
                    disableRemotePlayback={true}
                    controlsList="nofullscreen"
                />
            </EditingAreaContainer>
        </div>
    );
};
