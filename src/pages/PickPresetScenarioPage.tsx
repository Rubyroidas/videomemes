import {Link, useNavigate} from 'react-router-dom';
import {useTranslation} from 'react-i18next';

import {AppTitle, ListTitle} from '../components/App.styles';
import {ScenarioPicker} from '../components/ScenarioPicker/ScenarioPicker';
import {Button} from './HomePage.styles';
import {useEffect} from 'react';
import {useStore} from '../store';
import {HomeIcon} from '../icons/HomeIcon';
import {LanguageSelector} from '../components/LanguageSelector';

export const PickPresetScenarioPage = () => {
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
                {t('pickPreset.title')}
                <LanguageSelector/>
            </AppTitle>
            <ListTitle>
                {t('pickPreset.pickPreset')}
            </ListTitle>
            <ScenarioPicker/>
            <ListTitle>{t('general.or')}</ListTitle>
            <Button to="/new-scenario">
                {t('pickPreset.editFromScratchButton')}
            </Button>
        </div>
    );
};
