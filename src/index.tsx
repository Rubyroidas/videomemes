import {createRoot} from 'react-dom/client';

import './i18n';
import {App} from './components/App';
import {createStoreContextProvider} from './store';
import {createApiContextProvider} from './services/apiContext';
import {AppRouter} from './AppRouter';

const StoreContextProvider = createStoreContextProvider();
const ApiContextProvider = createApiContextProvider();

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
