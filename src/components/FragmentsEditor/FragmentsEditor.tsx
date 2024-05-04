import {useEffect, useState} from 'react';
import {observer} from 'mobx-react';

import {useStore} from '../../store';
import {UserFragment} from '../../types';
import {escapeHTML, html2text} from '../../utils';
import {Header, NavigateCaption} from './FragmentEditor.styles';
import {NavigationBar} from './NavigationBar';
import {FragmentEditor} from './FragmentEditor';
import {AnalyticsEvent, sendAnalyticsEvent} from '../../services/analytics';

type FragmentsEditorProps = {
    disabled: boolean;
}

export const FragmentsEditor = observer((props: FragmentsEditorProps) => {
    const store = useStore();
    const {disabled} = props;
    const [fragmentIndex, setFragmentIndex] = useState(0);
    if (!store.scenario?.fragments) {
        return null;
    }
    const userFragments = store.scenario.fragments;

    useEffect(() => {
        sendAnalyticsEvent(AnalyticsEvent.EditFragment_IndexChanged, {
            index: fragmentIndex,
            total: userFragments.length,
        });
    }, [fragmentIndex]);

    const onProxyChange = (fragment: UserFragment) => {
        if (!store.scenario?.fragments) {
            return;
        }

        store.scenario.fragments[fragmentIndex] = {
            ...fragment,
            text: html2text(fragment.text),
        };
    };

    const userFragment = userFragments[fragmentIndex];
    const preparedUserFragment = {
        ...userFragment,
        text: userFragment.text.split('\n')
                .map((line) => `<div>${escapeHTML(line)}</div>`)
                .join(''),
    };

    const canGoLeft = fragmentIndex > 0;
    const canGoRight = fragmentIndex < userFragments.length - 1;

    const collection = store.getCollection(userFragment.collectionId)!;
    const item = store.getCollectionItem(userFragment.collectionId, userFragment.fragmentId)!;

    return (
        <div>
            <Header>
                <NavigationBar
                    page={fragmentIndex + 1}
                    totalPages={userFragments.length}
                    canGoLeft={canGoLeft}
                    canGoRight={canGoRight}
                    setIndex={setFragmentIndex}
                />
                <NavigateCaption>
                    <b>{collection.name}</b> "{item.text}"
                </NavigateCaption>
            </Header>
            <FragmentEditor
                key={preparedUserFragment.id}
                userFragment={preparedUserFragment}
                disabled={disabled}
                onChange={onProxyChange}
            />
        </div>
    );
});
