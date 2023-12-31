import {ChangeEvent, FC, useState} from 'react';
import styled from '@emotion/styled';

import {Collection, UserPhrase} from './types';

type PhraseEditorProps = {
    disabled: boolean;
    collections: Collection[];
    userPhrases: UserPhrase[];
    onChange: (phrases: UserPhrase[]) => void;
}
const Header = styled.div`
`;
const EditingAreaContainer = styled.div`
  width: 400px;
    position: relative;

  @media (max-width: 480px) {
    width: 100vw;
  }
`;
const InputBackground = styled.div`
    position: absolute;
  width: 100%;
  height: 50%;
  background-color: #fff;
  z-index: 1;
`;
const TextArea = styled.textarea`
    position: absolute;
  width: 100%;
  height: 100%;

  background-color: transparent;
  color: red;
  font-family: sans-serif;
  font-size: 24px;
  text-align: center;

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
    const handlePhraseChange = (e: ChangeEvent) => {
        const result = [...userPhrases];
        const text = (e.target as HTMLInputElement).value;
        result[phraseIndex] = {
            ...result[phraseIndex],
            text,
        };
        onChange(result);
    };

    const userPhrase = userPhrases[phraseIndex];
    const collection = collections.find(c => c.id === userPhrase.collectionId)!;
    const item = collection.items.find(item => item.id === userPhrase.phraseId)!;

    const canGoLeft = phraseIndex > 0;
    const canGoRight = phraseIndex < userPhrases.length - 1;

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
            <EditingAreaContainer>
            <InputBackground>
                <TextArea
                    placeholder={item.name}
                    disabled={disabled}
                    value={userPhrase.text}
                    onChange={handlePhraseChange}
                />
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
