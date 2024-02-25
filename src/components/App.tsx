import {observer} from 'mobx-react';

import {useStore} from '../store';
import {useLoadInitialData} from '../hooks/useLoadInitialData';
import {FC, PropsWithChildren} from 'react';

export const App: FC<PropsWithChildren> = observer(({children}) => {
    const store = useStore();
    const {failedBrowser} = useLoadInitialData();
    if (failedBrowser) {
        return (
            <div>your browser is outdated. Please upgrade to the newest version</div>
        );
    }

    return !store.ffmpeg || !store.collections || !store.presets ? (
        <div>Loading...</div>
    ) : (
        children
    )
});
