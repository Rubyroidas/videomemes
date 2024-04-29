import {FC} from 'react';
import clsx from 'clsx';

import {UserFragment, UserFragmentType} from '../../types';
import {useStore} from '../../store';
import {
    ScenarioItemClipTitle, ScenarioItemDeleteButton,
    ScenarioItemDuration, ScenarioItemIndexNumber,
    ScenarioItemUserText, ScenarioItemWrapper, ScenarioItemWrapperGrid,
} from './ScenarioEditor.styles';
import {DeleteIcon} from '../../icons/DeleteIcon';
import {SnapshotPreview} from './SnapshotPreview';

type ScenarioItemProps = {
    index: number;
    isDragging: boolean;
    phrase: UserFragment;
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
    const {collection, item: collectionItem} = store.getCollectionAndItem(phrase.collectionId, phrase.fragmentId);
    if (!collection || !collectionItem) {
        return null;
    }

    return (
        <ScenarioItemWrapper className={clsx({isDragging})}>
            <SnapshotPreview
                collectionItem={collectionItem}
            />
            <ScenarioItemWrapperGrid>
                <ScenarioItemIndexNumber>
                    #{index}
                </ScenarioItemIndexNumber>
                <ScenarioItemUserText>
                    {phrase.type === UserFragmentType.PlainText ? phrase.text : (<i>image</i>)}
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
            </ScenarioItemWrapperGrid>
        </ScenarioItemWrapper>
    );
};
