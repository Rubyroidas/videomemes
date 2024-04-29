import {useState} from 'react';
import {createRoot} from 'react-dom/client';

import {App} from '../components/App';
import {createStoreContextProvider} from '../store';
import {createApiContextProvider} from '../services/apiContext';
import {GenerateTitleImageTest} from './GenerateTitleImageTest';
import {GenerateVideoTest} from './GenerateVideoTest';
import {GenerateTitleVideoTest} from './GenerateTitleVideoTest';
import {SliderCheckbox} from '../components/SliderCheckbox';

const StoreContextProvider = createStoreContextProvider();
const ApiContextProvider = createApiContextProvider();

const SliderTest = () => {
    const [checkbox1, setCheckbox1] = useState(false);
    const [checkbox2, setCheckbox2] = useState(true);

    return (
        <div>
            <SliderCheckbox
                defaultChecked={checkbox1}
                onClick={() => setCheckbox1(v => !v)}
            />
            <SliderCheckbox
                defaultChecked={checkbox2}
                onClick={() => setCheckbox2(v => !v)}
            />
        </div>
    );
}

const root = createRoot(document.querySelector('#root') as HTMLDivElement);
root.render(
    <StoreContextProvider>
        <ApiContextProvider>
            <App>
                <GenerateTitleImageTest/>
                <GenerateTitleVideoTest/>
                <GenerateVideoTest/>
                <SliderTest/>
            </App>
        </ApiContextProvider>
    </StoreContextProvider>
);
