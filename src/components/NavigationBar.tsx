import {FC} from 'react';

import {NavigateButton, NavigatePosition} from './PhraseEditor.styles';

type Props = {
    canGoLeft: boolean;
    canGoRight: boolean;
    page: number;
    totalPages: number;
    setIndex: (callback: (v: number) => number) => void;
}
export const NavigationBar: FC<Props> = ({canGoLeft, canGoRight, page, totalPages, setIndex}) => (
    <div>
        {canGoLeft && (
            <NavigateButton onClick={() => setIndex(i => i - 1)}>⬅️</NavigateButton>
        )}
        <NavigatePosition style={{color: '#888'}}>{page} / {totalPages}</NavigatePosition>
        {canGoRight && (
            <NavigateButton onClick={() => setIndex(i => i + 1)}>➡️</NavigateButton>
        )}
    </div>
);
