import {observer} from 'mobx-react';

import {useStore} from '../../store';
import {Collection, CollectionItem} from '../../types';
import {CollectionItemElement} from './CollectionItemElement';
import {MAX_VIDEO_LENGTH_SECONDS} from '../../config';
import {AddFragmentCollectionItemList, AddFragmentCollectionList, CollectionElement} from './ScenarioEditor.styles';
import {Button, ListTitle} from '../App.styles';
import {AnalyticsEvent, sendAnalyticsEvent} from '../../services/analytics';

type Props = {
    onSelect: (collection: Collection, item: CollectionItem) => void;
}

export const AddFragment = observer(({onSelect}: Props) => {
    const store = useStore();

    const handlePickCollection = (collection: Collection | undefined) => {
        sendAnalyticsEvent(AnalyticsEvent.Scenario_OpenedCollection, {
            collection_id: collection?.id,
        });
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
            <AddFragmentCollectionList>
                {collections.map(collection => (
                    <CollectionElement
                        className="preloading"
                        key={collection.id}
                        onClick={() => handlePickCollection(collection)}
                    >
                        <img
                            loading="lazy"
                            alt={collection.name}
                            src={collection.cover}
                            crossOrigin="anonymous"
                        />
                        <div className="name">{collection.name}</div>
                        <div className="videos-count">{collection.items.length} videos</div>
                    </CollectionElement>
                ))}
            </AddFragmentCollectionList>
        </div>
    ) : (
        <div>
            <ListTitle>Pick a fragment</ListTitle>
            <Button onClick={() => handlePickCollection(undefined)}>
                Pick another collection
            </Button>
            <AddFragmentCollectionItemList>
                {selectedCollection.items.map(((item, index) => (
                    <CollectionItemElement
                        key={item.id}
                        index={index + 1}
                        item={item}
                        onClick={() => onSelect(selectedCollection, item)}
                        disabled={store.scenarioTotalDuration + item.duration > MAX_VIDEO_LENGTH_SECONDS}
                    />
                )))}
            </AddFragmentCollectionItemList>
        </div>
    );
});
