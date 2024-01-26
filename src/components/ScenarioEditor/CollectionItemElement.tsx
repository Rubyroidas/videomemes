import {FC, HTMLProps} from 'react';
import styled from '@emotion/styled';

import {CollectionItem} from '../../types';
import {ScenarioItemClipTitle, SnapshotPreview} from './ScenarioEditor.styles';

const CollectionItemElementWrapper = styled.div<{ disabled: boolean }>`
    cursor: pointer;
    opacity: ${props => props.disabled ? '0.5' : '1'};
    margin: 0 0 24px 0;

    @media (max-width: 480px) {
        margin: 0 0 6vw 0;
    }
`;

type Props = {
    index: number;
    disabled: boolean;
    item: CollectionItem;
}
export const CollectionItemElement: FC<HTMLProps<HTMLDivElement> & Props> = ({index, item, disabled, onClick}) => (
    <CollectionItemElementWrapper onClick={disabled ? undefined : onClick} disabled={disabled}>
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
            <b>{index}</b> {item.text}
        </ScenarioItemClipTitle>
    </CollectionItemElementWrapper>
);
