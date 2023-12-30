import {ChangeEvent, FC} from 'react';

import {Collection, UserPhrase} from './types';

type PhraseEditorProps = {
    collections: Collection[];
    userPhrases: UserPhrase[];
    onChange: (phrases: UserPhrase[]) => void;
}
export const PhraseEditor: FC<PhraseEditorProps> = ({collections, userPhrases, onChange}) => {
    const handlePhraseChange = (index: number, e: ChangeEvent) => {
        console.log(`input at ${index}`, e);
        const result = [...userPhrases];
        result[index] = {
            ...result[index],
            text: (e.target as HTMLInputElement).value,
        }
        onChange(result);
    };

    const texts = userPhrases.map(userPhrase => {
        const collection = collections.find(c => c.id === userPhrase.collectionId);
        const item = collection?.items.find(item => item.id === userPhrase.phraseId);
        return {
            text: userPhrase.text,
            placeholder: item?.name
        };
    });

    return (
        <div>
            Edit phrases
            {texts.map(({text, placeholder}, index) => (
                <div key={index}>
                    <input
                        placeholder={placeholder}
                        type="text"
                        value={text}
                        onChange={e => handlePhraseChange(index, e)}
                    />
                </div>
            ))}
        </div>
    );
};
