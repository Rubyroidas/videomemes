import {AppTitle, BasicLink} from '../components/App.styles';
import {ScenarioPicker} from '../components/ScenarioPicker/ScenarioPicker';
import {Button} from './HomePage.styles';

export const PickPresetScenarioPage = () => (
    <div>
        <BasicLink to="/">go home</BasicLink>
        <AppTitle>Pick scenario</AppTitle>
        <ScenarioPicker/>
        <div>or</div>
        <Button to="/edit-phrases">Edit from scratch</Button>
    </div>
);
