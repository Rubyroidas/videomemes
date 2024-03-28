import {FC} from 'react';
import clsx from 'clsx';

import {UserPhrase, UserPhraseType} from '../../types';
import {useStore} from '../../store';
import {
    ScenarioItemClipTitle, ScenarioItemDeleteButton,
    ScenarioItemDuration, ScenarioItemIndexNumber,
    ScenarioItemUserText, ScenarioItemWrapper,
    SnapshotPreview
} from './ScenarioEditor.styles';
import {DeleteIcon} from '../../icons/DeleteIcon';

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
    const {collection, item: collectionItem} = store.getCollectionAndItem(phrase.collectionId, phrase.phraseId);
    if (!collection || !collectionItem) {
        return null;
    }

    return (
        <ScenarioItemWrapper className={clsx({isDragging})}>
            <SnapshotPreview>
                <img
                    alt={collection.name}
                    src={collectionItem.snapshot}
                    crossOrigin="anonymous"
                />
            </SnapshotPreview>
            <ScenarioItemIndexNumber>
                #{index}
            </ScenarioItemIndexNumber>
            <ScenarioItemUserText>
                {phrase.type === UserPhraseType.PlainText ? phrase.text : (<i>image</i>)}
            </ScenarioItemUserText>
            {!isDragging && (
                <ScenarioItemDeleteButton
                    title="delete"
                    onClick={disabled ? undefined : onDelete}
                >
                    <DeleteIcon/>
                </ScenarioItemDeleteButton>
            )}
            <ScenarioItemClipTitle>
                {collectionItem.text}
            </ScenarioItemClipTitle>
            <ScenarioItemDuration>
                {collectionItem.duration.toFixed(1)}s
            </ScenarioItemDuration>
        </ScenarioItemWrapper>
    );
};
