import {createBrowserRouter, RouterProvider} from 'react-router-dom';

import {HomePage} from './pages/HomePage';
import {EditFragmentsPage} from './pages/EditFragmentsPage';
import {AboutPage} from './pages/AboutPage';
import {ContactUsPage} from './pages/ContactUsPage';
import {DonatePage} from './pages/DonatePage';
import {NewScenarioPage} from './pages/NewScenarioPage';
import {PickPresetScenarioPage} from './pages/PickPresetScenarioPage';
import {EditScenarioPage} from './pages/EditScenarioPage';
import {DownloadResultPage} from './pages/DownloadResultPage';
import {FeedPage} from './pages/FeedPage';
import {TitleSetupPage} from './pages/TitleSetupPage';
import {FeedItemPage} from './pages/FeedItemPage';

const router = createBrowserRouter([
    {
        path: '/',
        element: <HomePage/>,
    },
    {
        path: '/new-scenario',
        element: <NewScenarioPage/>,
    },
    {
        path: '/title-setup',
        element: <TitleSetupPage/>,
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
        path: '/edit-fragments',
        element: <EditFragmentsPage/>,
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
        path: '/feed/:id',
        element: <FeedItemPage/>,
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
