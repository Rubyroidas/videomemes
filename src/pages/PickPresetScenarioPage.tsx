import {Link} from 'react-router-dom';

import {AppTitle} from '../components/App.styles';
import {ScenarioPicker} from '../components/ScenarioPicker/ScenarioPicker';
import {Button} from './HomePage.styles';

export const PickPresetScenarioPage = () => (
    <div>
        <Link to="/">go home</Link>
        <AppTitle>Pick scenario</AppTitle>
        <ScenarioPicker/>
        <div>or</div>
        <Button to="/edit-phrases">Edit from scratch</Button>
    </div>
);
