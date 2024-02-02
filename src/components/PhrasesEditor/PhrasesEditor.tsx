import {FC, useState} from 'react';
import {observer} from 'mobx-react';

import {useStore} from '../../store';
import {UserPhrase} from '../../types';
import {escapeHTML, html2text} from '../../utils';
import {Header, NavigateCaption} from './PhraseEditor.styles';
import {NavigationBar} from './NavigationBar';
import {PhraseEditor} from './PhraseEditor';

type PhrasesEditorProps = {
    disabled: boolean;
}

export const PhrasesEditor: FC<PhrasesEditorProps> = observer((props) => {
    const store = useStore();
    const {disabled} = props;
    const [phraseIndex, setPhraseIndex] = useState(0);
    if (!store.scenario?.phrases) {
        return null;
    }
    const userPhrases = store.scenario.phrases;

    const onProxyChange = (phrase: UserPhrase) => {
        if (!store.scenario?.phrases) {
            return;
        }

        store.scenario.phrases[phraseIndex] = {
            ...phrase,
            text: html2text(phrase.text),
        };
    };

    const userPhrase = userPhrases[phraseIndex];
    const preparedUserPhrase = {
        ...userPhrase,
        text: userPhrase.text.split('\n')
                .map((line) => `<div>${escapeHTML(line)}</div>`)
                .join(''),
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
                disabled={disabled}
                onChange={onProxyChange}
            />
        </div>
    );
});
