import {AppTitle, BasicLink} from '../components/App.styles';
import {ScenarioEditor} from '../components/ScenarioEditor/ScenarioEditor';

export const EditScenarioPage = () => (
    <div>
        <BasicLink to="/">go home</BasicLink>
        <AppTitle>Edit scenario</AppTitle>
        <ScenarioEditor/>
    </div>
);
