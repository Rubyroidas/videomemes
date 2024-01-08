import {createRoot} from 'react-dom/client';

import {App} from './components/App';
import {createStoreContextProvider} from './store';

const StoreContextProvider = createStoreContextProvider();

const root = createRoot(document.querySelector('#root') as HTMLDivElement);
root.render(
    <StoreContextProvider>
        <App/>
    </StoreContextProvider>
);
