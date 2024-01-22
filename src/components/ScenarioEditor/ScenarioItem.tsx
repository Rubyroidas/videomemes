import {FC} from 'react';

import {UserPhrase} from '../../types';
import {useStore} from '../../store';
import {
    ScenarioItemWrapper,
    ScenarioItemButton,
    ScenarioItemDragger,
    IndexColumn,
    SnapshotPreview,
    ScenarioItemUserText,
    ScenarioItemClipTitle,
    ScenarioItemCollectionName
} from './ScenarioEditor.styles';
import {DragIcon} from '../../icons/DragIcon';

type ScenarioItemProps = {
    index: number;
    phrase: UserPhrase;
    canMoveUp: boolean;
    canMoveDown: boolean;
    disabled: boolean;
    onDelete: () => void;
    onMoveUp: () => void;
    onMoveDown: () => void;
}
export const ScenarioItem: FC<ScenarioItemProps> = (props) => {
    const {
        index,
        phrase,
        canMoveUp,
        canMoveDown,
        disabled,
        onDelete,
        onMoveUp,
        onMoveDown
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
        <ScenarioItemWrapper>
            <div style={{gridArea: 'dragger'}}>
                <ScenarioItemDragger title="TODO: drag up/down by this">
                    <DragIcon/>
                </ScenarioItemDragger>
                <ScenarioItemButton
                    title="delete"
                    onClick={onDelete}
                    disabled={disabled}
                >❌</ScenarioItemButton>
                <ScenarioItemButton
                    title="move up"
                    onClick={onMoveUp}
                    disabled={!canMoveUp || disabled}
                >🔼</ScenarioItemButton>
                <ScenarioItemButton
                    title="move down"
                    onClick={onMoveDown}
                    disabled={!canMoveDown || disabled}
                >🔽</ScenarioItemButton>
            </div>
            <IndexColumn>
                #{index}
            </IndexColumn>
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
