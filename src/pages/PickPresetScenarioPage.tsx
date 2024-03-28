import {Link, useNavigate} from 'react-router-dom';

import {AppTitle} from '../components/App.styles';
import {ScenarioPicker} from '../components/ScenarioPicker/ScenarioPicker';
import {Button} from './HomePage.styles';
import {useEffect} from 'react';
import {useStore} from '../store';
import {HomeIcon} from '../icons/HomeIcon';

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
            <AppTitle>
                <Link to="/">
                    <HomeIcon/>
                </Link>
                Pick scenario
            </AppTitle>
            <ScenarioPicker/>
            <div>or</div>
            <Button to="/new-scenario">Edit from scratch</Button>
        </div>
    );
};
