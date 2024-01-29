import {createRoot} from 'react-dom/client';

import {App} from './components/App';
import {createStoreContextProvider} from './store';
import {createApiContextProvider} from './services/apiContext';

const StoreContextProvider = createStoreContextProvider();
const ApiContextProvider = createApiContextProvider();

const root = createRoot(document.querySelector('#root') as HTMLDivElement);
root.render(
    <StoreContextProvider>
        <ApiContextProvider>
            <App/>
        </ApiContextProvider>
    </StoreContextProvider>
);
