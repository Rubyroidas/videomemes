import {FC} from 'react';

import {UserPhrase} from '../../types';
import {useStore} from '../../store';
import {ScenarioItemButton, ScenarioItemDragger, ScenarioItemWrapper} from './ScenarioEditor.styles';
import {DragIcon} from '../../icons/DragIcon.tsx';

type ScenarioItemProps = {
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
            <ScenarioItemDragger>
                <DragIcon/>
            </ScenarioItemDragger>
            <ScenarioItemButton onClick={onDelete} disabled={disabled}>❌</ScenarioItemButton>
            <ScenarioItemButton onClick={onMoveUp} disabled={!canMoveUp || disabled}>🔼</ScenarioItemButton>
            <ScenarioItemButton onClick={onMoveDown} disabled={!canMoveDown || disabled}>🔽</ScenarioItemButton>
            <div>
                <img
                    alt={collection.name}
                    src={collectionItem.snapshot}
                    crossOrigin="anonymous"
                />
            </div>
            <div>
                <div>collection: {collection.name}</div>
                <div>clip: {collectionItem.text}</div>
                <div>your text: {phrase.text ?? (<i>image was specified</i>)}</div>
            </div>
        </ScenarioItemWrapper>
    );
};
