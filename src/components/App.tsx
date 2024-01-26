import {observer} from 'mobx-react';

import {useStore} from '../store';
import {useLoadInitialData} from '../hooks/useLoadInitialData';
import {AppRouter} from '../AppRouter';

export const App = observer(() => {
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
        <AppRouter/>
    )
});
