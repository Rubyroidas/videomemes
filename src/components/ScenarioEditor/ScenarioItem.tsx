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
    fragment: UserFragment;
    disabled: boolean;
    onDelete: () => void;
}
export const ScenarioItem: FC<ScenarioItemProps> = (props) => {
    const {
        index,
        isDragging,
        fragment,
        disabled,
        onDelete,
    } = props;
    const store = useStore();
    const {collection, item: collectionItem} = store.getCollectionAndItem(fragment.collectionId, fragment.fragmentId);
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
                    {fragment.type === UserFragmentType.PlainText ? fragment.text : (<i>image</i>)}
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
