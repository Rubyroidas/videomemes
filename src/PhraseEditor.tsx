import {ChangeEvent, FC, useState} from 'react';

import {Collection, UserPhrase} from './types';

type PhraseEditorProps = {
    disabled: boolean;
    collections: Collection[];
    userPhrases: UserPhrase[];
    onChange: (phrases: UserPhrase[]) => void;
}
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
            Edit phrases
            <div>
                {canGoLeft && (
                    <span onClick={() => setPhraseIndex(i => i - 1)}>⬅️</span>
                )}
                <span>
                    {phraseIndex + 1} / {userPhrases.length} [{collection.id}]: {item.name}
                </span>
                {canGoRight && (
                    <span onClick={() => setPhraseIndex(i => i + 1)}>➡️</span>
                )}
            </div>
            <div>
                <input
                    placeholder={item.name}
                    disabled={disabled}
                    type="text"
                    value={userPhrase.text}
                    onChange={handlePhraseChange}
                />
            </div>
        </div>
    );
};
