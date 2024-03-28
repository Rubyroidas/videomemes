import {FC, HTMLProps} from 'react';
import clsx from 'clsx';

import {CollectionItem} from '../../types';
import {
    ScenarioItemClipTitle, ScenarioItemDeleteButton, ScenarioItemDuration,
    ScenarioItemIndexNumber,
    ScenarioItemWrapper, ScenarioItemWrapperGrid,
} from './ScenarioEditor.styles';
import {AddIcon} from '../../icons/AddIcon';
import {SnapshotPreview} from './SnapshotPreview';

type Props = {
    index: number;
    disabled: boolean;
    item: CollectionItem;
}
export const CollectionItemElement: FC<HTMLProps<HTMLDivElement> & Props> = ({index, item, disabled, onClick}) => (
    <ScenarioItemWrapper className={clsx({disabled})}>
        <SnapshotPreview
            collectionItem={item}
        />
        <ScenarioItemWrapperGrid>
            <ScenarioItemIndexNumber>
                #{index}
            </ScenarioItemIndexNumber>
            <ScenarioItemClipTitle>
                {item.text}
            </ScenarioItemClipTitle>
            <ScenarioItemDeleteButton
                title="add"
                onClick={disabled ? undefined : onClick}
            >
                <AddIcon/>
            </ScenarioItemDeleteButton>
            <ScenarioItemDuration>
                {item.duration.toFixed(1)}s
            </ScenarioItemDuration>
        </ScenarioItemWrapperGrid>
    </ScenarioItemWrapper>
);
