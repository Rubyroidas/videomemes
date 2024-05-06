import {useEffect} from 'react';
import {observer} from 'mobx-react';
import {Link, useNavigate} from 'react-router-dom';
import {useTranslation} from 'react-i18next';

import {AppTitle} from '../components/App.styles';
import {ScenarioEditor} from '../components/ScenarioEditor/ScenarioEditor';
import {useStore} from '../store';
import {HomeIcon} from '../icons/HomeIcon';

export const EditScenarioPage = observer(() => {
    const {t} = useTranslation();
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
                {t('editScenario.title')}
            </AppTitle>
            <ScenarioEditor/>
        </div>
    );
});
