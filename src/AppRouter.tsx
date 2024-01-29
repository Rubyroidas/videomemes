import {createBrowserRouter, RouterProvider} from 'react-router-dom';

import {HomePage} from './pages/HomePage';
import {EditPhrasesPage} from './pages/EditPhrasesPage';
import {EditScenarioPage} from './pages/EditScenarioPage';
import {AboutPage} from './pages/AboutPage';
import {ContactUsPage} from './pages/ContactUsPage';
import {DonatePage} from './pages/DonatePage';
import {PickPresetScenarioPage} from './pages/PickPresetScenarioPage';
import {DownloadResultPage} from './pages/DownloadResultPage';
import {FeedPage} from './pages/FeedPage';

const router = createBrowserRouter([
    {
        path: '/',
        element: <HomePage/>,
    },
    {
        path: '/pick-preset-scenario',
        element: <PickPresetScenarioPage/>,
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
        path: '/download-result',
        element: <DownloadResultPage/>,
    },
    {
        path: '/feed',
        element: <FeedPage/>,
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
