import {FC, HTMLProps} from 'react';
import clsx from 'clsx';

import {CollectionItem} from '../../types';
import {
    ScenarioItemClipTitle, ScenarioItemDuration,
    ScenarioItemIndexNumber,
    ScenarioItemWrapper,
    SnapshotPreview
} from './ScenarioEditor.styles';

type Props = {
    index: number;
    disabled: boolean;
    item: CollectionItem;
}
export const CollectionItemElement: FC<HTMLProps<HTMLDivElement> & Props> = ({index, item, disabled, onClick}) => (
    <ScenarioItemWrapper onClick={disabled ? undefined : onClick} className={clsx({disabled})}>
        <SnapshotPreview>
            <img
                alt={item.text}
                src={item.snapshot}
                crossOrigin="anonymous"
            />
        </SnapshotPreview>
        <ScenarioItemIndexNumber>
            #{index}
        </ScenarioItemIndexNumber>
        <ScenarioItemClipTitle>
            {item.text}
        </ScenarioItemClipTitle>
        <ScenarioItemDuration>
            {item.duration.toFixed(1)}s
        </ScenarioItemDuration>
    </ScenarioItemWrapper>
);
