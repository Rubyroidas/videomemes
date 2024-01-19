import {createBrowserRouter, RouterProvider} from 'react-router-dom';

import {HomePage} from './pages/HomePage';
import {EditPhrasesPage} from './pages/EditPhrasesPage';
import {EditScenarioPage} from './pages/EditScenarioPage';
import {AboutPage} from './pages/AboutPage';
import {ContactUsPage} from './pages/ContactUsPage';
import {DonatePage} from './pages/DonatePage';

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
    {
        path: '/about',
        element: <AboutPage/>,
    },
    {
        path: '/contact-us',
        element: <ContactUsPage/>,
    },
    {
        path: '/donate',
        element: <DonatePage/>,
    },
]);

export const AppRouter = () => (
    <RouterProvider router={router}/>
);
