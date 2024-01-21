import {FC} from 'react';

import {UserPhrase} from '../../types';
import {useStore} from '../../store';
import {ScenarioItemWrapper} from './ScenarioEditor.styles';

type ScenarioItemProps = {
    phrase: UserPhrase;
}
export const ScenarioItem: FC<ScenarioItemProps> = ({phrase}) => {
    const store = useStore();
    const collection = store.collections
        ?.find(c => phrase.collectionId === c.id);
    const collectionItem = collection?.items
        ?.find(item => phrase.phraseId === item.id);
    if (!collection || !collectionItem) {
        return null;
    }

    return (
        <ScenarioItemWrapper>
            <div>drag me (TODO)</div>
            <button>remove (TODO)</button>
            <div>
                <img
                    alt={collection.name}
                    src={collectionItem.snapshot}
                    crossOrigin="anonymous"
                />
            </div>
            <div>collection: {collection.name}</div>
            <div>clip: {collectionItem.text}</div>
        </ScenarioItemWrapper>
    );
};
