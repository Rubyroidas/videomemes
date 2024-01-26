import {FC, HTMLProps} from 'react';
import styled from '@emotion/styled';

import {CollectionItem} from '../../types';
import {ScenarioItemClipTitle, SnapshotPreview} from './ScenarioEditor.styles';

const CollectionItemElementWrapper = styled.div<{ disabled: boolean }>`
    cursor: pointer;

    opacity: ${props => props.disabled ? '0.5' : '1'};
`;

type Props = {
    disabled: boolean;
    item: CollectionItem;
}
export const CollectionItemElement: FC<HTMLProps<HTMLDivElement> & Props> = ({item, disabled, onClick}) => (
    <CollectionItemElementWrapper onClick={disabled ? undefined : onClick} disabled={disabled}>
        [{item.duration.toFixed(2)}] {item.text}
        <SnapshotPreview>
            <div>
                <img
                    alt={item.text}
                    src={item.snapshot}
                    crossOrigin="anonymous"
                />
                <label>{item.duration.toFixed(2)}</label>
            </div>
        </SnapshotPreview>
        <ScenarioItemClipTitle>
            <label>clip</label>
            {item.text}
        </ScenarioItemClipTitle>
    </CollectionItemElementWrapper>
);
