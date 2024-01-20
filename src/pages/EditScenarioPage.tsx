import {Link} from 'react-router-dom';

import {AppTitle} from '../components/App.styles';
import {ScenarioEditor} from '../components/ScenarioEditor/ScenarioEditor';

export const EditScenarioPage = () => (
    <div>
        <Link to="/">go home</Link>
        <AppTitle>Edit scenario</AppTitle>
        <ScenarioEditor/>
    </div>
);
