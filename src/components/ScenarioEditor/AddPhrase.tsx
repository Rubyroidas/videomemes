import {FC, useState} from 'react';

import {useStore} from '../../store';
import {Collection, CollectionItem} from '../../types';
import {CollectionItemElement} from './CollectionItemElement.tsx';
import {MAX_VIDEO_LENGTH_SECONDS} from '../../config.ts';
import {AddPhraseCollectionItemList, AddPhraseCollectionList, CollectionElement} from './ScenarioEditor.styles.ts';

type Props = {
    onSelect: (collection: Collection, item: CollectionItem) => void;
}

export const AddPhrase: FC<Props> = ({onSelect}) => {
    const store = useStore();
    const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);

    const collections = store.collections;
    if (!collections) {
        return null;
    }

    return !selectedCollection ? (
        <div>
            pick a collection:
            <AddPhraseCollectionList>
                {collections.map(collection => (
                    <CollectionElement
                        key={collection.id}
                        onClick={() => setSelectedCollection(collection)}
                    >
                        {collection.name}
                    </CollectionElement>
                ))}
            </AddPhraseCollectionList>
        </div>
    ) : (
        <div>
            pick a clip:
            <AddPhraseCollectionItemList>
                {selectedCollection.items.map(((item, index) => (
                    <CollectionItemElement
                        key={item.id}
                        index={index + 1}
                        item={item}
                        onClick={() => onSelect(selectedCollection, item)}
                        disabled={store.scenarioTotalDuration + item.duration > MAX_VIDEO_LENGTH_SECONDS}
                    />
                )))}
            </AddPhraseCollectionItemList>
        </div>
    );
}
