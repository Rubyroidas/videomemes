import {FC, PropsWithChildren} from 'react';
import {observer} from 'mobx-react';
import {useTranslation} from 'react-i18next';

import {useStore} from '../store';
import {useLoadInitialData} from '../hooks/useLoadInitialData';

export const App: FC<PropsWithChildren> = observer(({children}) => {
    const {t} = useTranslation();
    const store = useStore();
    const {failedBrowser} = useLoadInitialData();
    if (failedBrowser) {
        return (
            <div>{t('general.yourBrowserIsNotSupported')}</div>
        );
    }

    return !store.ffmpeg || !store.collections || !store.presets ? (
        <div>{t('general.pageLoading')}</div>
    ) : (
        children
    )
});
