import {FC} from 'react';

import {UserPhrase} from '../../types';
import {useStore} from '../../store';
import {
    IndexColumn,
    ScenarioItemButton,
    ScenarioItemDragger, ScenarioItemTexts,
    ScenarioItemWrapper,
    SnapshotPreview
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

    return (
        <ScenarioItemWrapper>
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
            <IndexColumn>
                #{index}
            </IndexColumn>
            <SnapshotPreview>
                <img
                    alt={collection.name}
                    src={collectionItem.snapshot}
                    crossOrigin="anonymous"
                />
            </SnapshotPreview>
            <ScenarioItemTexts>
                <div>collection: {collection.name}</div>
                <div>clip: {collectionItem.text}</div>
                <div>your text: {phrase.text ?? (<i>image was specified</i>)}</div>
            </ScenarioItemTexts>
        </ScenarioItemWrapper>
    );
};
