import {FC, useState} from 'react';
import styled from '@emotion/styled';

import {useStore} from '../../store';
import {Collection, CollectionItem} from '../../types';

const CollectionElement = styled.div`
    cursor: pointer;
`;
const CollectionItemElement = styled.div`
    cursor: pointer;
`;

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
            <div>
                {collections.map(collection => (
                    <CollectionElement
                        key={collection.id}
                        onClick={() => setSelectedCollection(collection)}
                    >
                        {collection.name}
                    </CollectionElement>
                ))}
            </div>
        </div>
    ) : (
        <div>
            pick a clip:
            <div>
                {selectedCollection.items.map(item => (
                    <CollectionItemElement
                        key={item.id}
                        onClick={() => onSelect(selectedCollection, item)}
                    >
                        {item.text}
                    </CollectionItemElement>
                ))}
            </div>
        </div>
    );
}
