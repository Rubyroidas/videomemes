import {createBrowserRouter, RouterProvider} from 'react-router-dom';

import {HomePage} from './pages/HomePage';
import {EditPhrasesPage} from './pages/EditPhrasesPage';
import {EditScenarioPage} from './pages/EditScenarioPage';

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

export const AppRouter = () => (
    <RouterProvider router={router}/>
);
