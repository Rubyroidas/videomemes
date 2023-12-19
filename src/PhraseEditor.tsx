import {ChangeEvent, FC} from 'react';

import {PhraseConfig} from './models';

type PhraseEditorProps = {
    phrases: string[];
    phrasesConfig: PhraseConfig[];
    onChange: (phrases: string[]) => void;
}
export const PhraseEditor: FC<PhraseEditorProps> = ({phrases, phrasesConfig, onChange}) => {
    const handlePhraseChange = (index: number, e: ChangeEvent) => {
        console.log(`input at ${index}`, e);
        const result = [...phrases];
        result[index] = (e.target as HTMLInputElement).value;
        onChange(result);
    };

    return (
        <div>
            Edit phrases
            {phrases.map((phrase, index) => (
                <div key={index}>
                    <input
                        placeholder={phrasesConfig[index].phrase}
                        type="text"
                        value={phrase}
                        onChange={e => handlePhraseChange(index, e)}
                    />
                </div>
            ))}
        </div>
    );
};
