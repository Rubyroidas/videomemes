import {observer} from 'mobx-react';

import {useStore} from '../../store';
import {Collection, CollectionItem} from '../../types';
import {CollectionItemElement} from './CollectionItemElement';
import {MAX_VIDEO_LENGTH_SECONDS} from '../../config';
import {AddPhraseCollectionItemList, AddPhraseCollectionList, CollectionElement} from './ScenarioEditor.styles';
import {Button, ListTitle} from '../App.styles';

type Props = {
    onSelect: (collection: Collection, item: CollectionItem) => void;
}

export const AddPhrase = observer(({onSelect}: Props) => {
    const store = useStore();

    const handlePickCollection = (collection: Collection | undefined) => {
        store.lastUsedCollectionId = collection?.id;
    };

    const collections = store.collections;
    if (!collections) {
        return null;
    }

    const {lastUsedCollectionId} = store;
    const selectedCollection = lastUsedCollectionId
        ? store.getCollection(lastUsedCollectionId)
        : undefined;

    return !selectedCollection ? (
        <div>
            <ListTitle>Pick a collection</ListTitle>
            <AddPhraseCollectionList>
                {collections.map(collection => (
                    <CollectionElement
                        key={collection.id}
                        onClick={() => handlePickCollection(collection)}
                    >
                        <img src={collection.cover} crossOrigin="anonymous" alt={collection.name}/>
                        <div className="name">{collection.name}</div>
                        <div className="videos-count">{collection.items.length} videos</div>
                    </CollectionElement>
                ))}
            </AddPhraseCollectionList>
        </div>
    ) : (
        <div>
            <ListTitle>Pick a fragment</ListTitle>
            <Button onClick={() => handlePickCollection(undefined)}>
                Pick another collection
            </Button>
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
});
