import {FC, useState} from 'react';

import {useStore} from '../../store';
import {Format, UserPhrase} from '../../types';
import {escapeHTML, html2text} from '../../utils';
import {Header, NavigateCaption} from './PhraseEditor.styles';
import {NavigationBar} from './NavigationBar';
import {PhraseEditor} from './PhraseEditor';

type PhrasesEditorProps = {
    disabled: boolean;
    userPhrases: UserPhrase[];
    format: Format;
    onChange: (phrases: UserPhrase[]) => void;
}

export const PhrasesEditor: FC<PhrasesEditorProps> = (props) => {
    const {disabled, userPhrases, onChange} = props;
    const [phraseIndex, setPhraseIndex] = useState(0);
    const store = useStore();

    const onProxyChange = (phrase: UserPhrase) => {
        const result = [...userPhrases];
        const escapedPhrase: UserPhrase = {
            ...phrase,
            text: phrase.text
                ? html2text(phrase.text)
                : phrase.text,
        };
        result[phraseIndex] = escapedPhrase;

        onChange(result);
    };

    const userPhrase = userPhrases[phraseIndex];
    const preparedUserPhrase = {
        ...userPhrase,
        text: userPhrase.text
            ? userPhrase.text.split('\n')
                .map((line) => `<div>${escapeHTML(line)}</div>`)
                .join('')
            : undefined
    };
    const canGoLeft = phraseIndex > 0;
    const canGoRight = phraseIndex < userPhrases.length - 1;
    const collection = store.collections!.find(c => c.id === userPhrase.collectionId)!;
    const item = collection.items.find(item => item.id === userPhrase.phraseId)!;

    return (
        <div>
            <Header>
                <NavigationBar
                    page={phraseIndex + 1}
                    totalPages={userPhrases.length}
                    canGoLeft={canGoLeft}
                    canGoRight={canGoRight}
                    setIndex={setPhraseIndex}
                />
                <NavigateCaption>
                    <b>{collection.name}</b> "{item.text}"
                </NavigateCaption>
            </Header>
            <PhraseEditor
                userPhrase={preparedUserPhrase}
                format={props.format}
                disabled={disabled}
                onChange={onProxyChange}
            />
        </div>
    );
};
