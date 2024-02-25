import {createRoot} from 'react-dom/client';

import {App} from '../components/App';
import {createStoreContextProvider} from '../store';
import {createApiContextProvider} from '../services/apiContext';
import {GenerateTitleImageTest} from './GenerateTitleImageTest';
import {GenerateVideoTest} from './GenerateVideoTest';
import {GenerateTitleVideoTest} from './GenerateTitleVideoTest';

const StoreContextProvider = createStoreContextProvider();
const ApiContextProvider = createApiContextProvider();

const root = createRoot(document.querySelector('#root') as HTMLDivElement);
root.render(
    <StoreContextProvider>
        <ApiContextProvider>
            <App>
                <GenerateTitleImageTest/>
                <GenerateTitleVideoTest/>
                <GenerateVideoTest/>
            </App>
        </ApiContextProvider>
    </StoreContextProvider>
);
