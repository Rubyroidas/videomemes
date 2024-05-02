import {createRoot} from 'react-dom/client';

import './i18n';
import {App} from './components/App';
import {createStoreContextProvider} from './store';
import {createApiContextProvider} from './services/apiContext';
import {AppRouter} from './AppRouter';
import {mountSentry} from './services/sentry';

const StoreContextProvider = createStoreContextProvider();
const ApiContextProvider = createApiContextProvider();

mountSentry();

const root = createRoot(document.querySelector('#root') as HTMLDivElement);
root.render(
    <StoreContextProvider>
        <ApiContextProvider>
            <App>
                <AppRouter/>
            </App>
        </ApiContextProvider>
    </StoreContextProvider>
);
