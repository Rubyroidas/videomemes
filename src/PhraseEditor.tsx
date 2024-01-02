import {ClipboardEventHandler, FC, useState} from 'react';
import ContentEditable, {ContentEditableEvent} from 'react-contenteditable';
import styled from '@emotion/styled';
import { css } from '@emotion/css';

import {Collection, Rect, Size, UserPhrase} from './types';

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
const TextAreaClass = (fontSize: number) => css`
  position: absolute;
  width: 100%;
  height: 100%;

  background-color: transparent;
  color: red;
  font-family: sans-serif;
  font-weight: bold;
  font-size: ${fontSize}px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;

  border: none;
  outline: none;
  overflow: hidden;
  resize: none;
`;
const Video = styled.video`
  width: 100%;
`;

export const PhraseEditor: FC<PhraseEditorProps> = (props) => {
    const {disabled, collections, userPhrases, onChange} = props;
    const [phraseIndex, setPhraseIndex] = useState(0);
    const handlePhraseChange = (e: ContentEditableEvent) => {
        const result = [...userPhrases];
        const text = (e.target as HTMLInputElement).value;
        result[phraseIndex] = {
            ...result[phraseIndex],
            text,
        };
        onChange(result);
    };
    const handlePaste: ClipboardEventHandler = (e) => {
        e.preventDefault();
        document.execCommand('inserttext', false, e.clipboardData.getData('text/plain'));
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
    const fontSize = 24 * collection.size.width / 512;

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
                        className={TextAreaClass(fontSize)}
                        html={userPhrase.text!}
                        onChange={handlePhraseChange} />
                </InputBackground>
                <Video
                    controls={true}
                    src={item.videoFile}
                    disablePictureInPicture={true}
                    controlsList="nofullscreen"
                />
            </EditingAreaContainer>
        </div>
    );
};
