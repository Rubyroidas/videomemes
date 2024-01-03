import {createRoot} from 'react-dom/client';

import {App} from './components/App';

const root = createRoot(document.querySelector('#root') as HTMLDivElement);
root.render(<App/>);
