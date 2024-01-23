import {FC} from 'react';

import {UserPhrase} from '../../types';
import {useStore} from '../../store';
import {
    ScenarioItemWrapper,
    ScenarioItemButton,
    SnapshotPreview,
    ScenarioItemUserText,
    ScenarioItemClipTitle,
    ScenarioItemCollectionName
} from './ScenarioEditor.styles';

type ScenarioItemProps = {
    index: number;
    isDragging: boolean;
    phrase: UserPhrase;
    disabled: boolean;
    onDelete: () => void;
}
export const ScenarioItem: FC<ScenarioItemProps> = (props) => {
    const {
        index,
        isDragging,
        phrase,
        disabled,
        onDelete,
    } = props;
    const store = useStore();
    const collection = store.collections
        ?.find(c => phrase.collectionId === c.id);
    const collectionItem = collection?.items
        ?.find(item => phrase.phraseId === item.id);
    if (!collection || !collectionItem) {
        return null;
    }

    const durationText = (Math.round(collectionItem.duration * 10) / 10).toFixed(1);

    return (
        <ScenarioItemWrapper isDragging={isDragging}>
            <div style={{gridArea: 'dragger'}}>
                #{index}
                <ScenarioItemButton
                    title="delete"
                    onClick={onDelete}
                    disabled={disabled}
                >❌</ScenarioItemButton>
            </div>
            <SnapshotPreview>
                <div>
                    <img
                        alt={collection.name}
                        src={collectionItem.snapshot}
                        crossOrigin="anonymous"
                    />
                    <label>{durationText}</label>
                </div>
            </SnapshotPreview>
            <ScenarioItemCollectionName>
                <label>collection</label>
                {collection.name}</ScenarioItemCollectionName>
            <ScenarioItemClipTitle>
                <label>clip</label>
                {collectionItem.text}</ScenarioItemClipTitle>
            <ScenarioItemUserText>
                <label>your text</label>
                {phrase.text ?? (<i>image was specified</i>)}
            </ScenarioItemUserText>
        </ScenarioItemWrapper>
    );
};
