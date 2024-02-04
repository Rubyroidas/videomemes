import {AppTitle, BasicLink} from '../components/App.styles';
import {ScenarioPicker} from '../components/ScenarioPicker/ScenarioPicker';
import {Button} from './HomePage.styles';
import {useEffect} from 'react';
import {useStore} from '../store';
import {useNavigate} from 'react-router-dom';

export const PickPresetScenarioPage = () => {
    const store = useStore();
    const navigate = useNavigate();

    useEffect(() => {
        if (!store.scenario) {
            navigate('/');
        }
    });

    if (!store.scenario) {
        return null;
    }

    return (
        <div>
            <BasicLink to="/">go home</BasicLink>
            <AppTitle>Pick scenario</AppTitle>
            <ScenarioPicker/>
            <div>or</div>
            <Button to="/edit-phrases">Edit from scratch</Button>
        </div>
    );
};
