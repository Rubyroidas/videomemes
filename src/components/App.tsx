import {useEffect} from 'react';
import {FFmpeg} from '@ffmpeg/ffmpeg';
import {observer} from 'mobx-react';

import {
    createBrowserRouter,
    RouterProvider,
} from 'react-router-dom';

import {loadCollections, loadFFmpeg} from '../utils';
import {useStore} from '../store';
import {HomePage} from '../pages/HomePage';
import {EditPhrasesPage} from '../pages/EditPhrasesPage';
import {EditScenarioPage} from '../pages/EditScenarioPage';

const router = createBrowserRouter([
    {
        path: '/',
        element: <HomePage/>,
    },
    {
        path: '/edit-scenario',
        element: <EditScenarioPage/>,
    },
    {
        path: '/edit-phrases',
        element: <EditPhrasesPage/>,
    },
]);

export const App = observer(() => {
    const store = useStore();
    useEffect(() => {
        const load = async () => {
            store.collections = await loadCollections();
        };
        load();
    }, []);
    useEffect(() => {
        const load = async () => {
            const ffmpeg = new FFmpeg();
            await loadFFmpeg(ffmpeg);
            store.ffmpeg = ffmpeg;
        };
        load();
    }, []);

    return !store.ffmpeg || !store.collections ? (
        <div>Loading...</div>
    ) : (
        <RouterProvider router={router}/>
    )
});
