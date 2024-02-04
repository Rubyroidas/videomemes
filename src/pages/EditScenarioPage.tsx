import {useEffect} from 'react';
import {observer} from 'mobx-react';
import {useNavigate} from 'react-router-dom';

import {AppTitle, BasicLink} from '../components/App.styles';
import {ScenarioEditor} from '../components/ScenarioEditor/ScenarioEditor';
import {useStore} from '../store';

export const EditScenarioPage = observer(() => {
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
            <AppTitle>Edit scenario</AppTitle>
            <ScenarioEditor/>
        </div>
    );
});
