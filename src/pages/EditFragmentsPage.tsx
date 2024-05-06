import {Link, useNavigate} from 'react-router-dom';
import {useTranslation} from 'react-i18next';

import {VideoEditor} from '../components/FragmentsEditor/VideoEditor';
import {AppTitle} from '../components/App.styles';
import {useEffect} from 'react';
import {useStore} from '../store';
import {HomeIcon} from '../icons/HomeIcon';

export const EditFragmentsPage = () => {
    const {t} = useTranslation();
    const store = useStore();
    const navigate = useNavigate();
    useEffect(() => {
        if (!store.scenario) {
            navigate('/edit-scenario');
        }
    }, []);

    return (
        <div>
            <AppTitle>
                <Link to="/">
                    <HomeIcon/>
                </Link>
                {t('editFragments.title')}
            </AppTitle>
            <VideoEditor/>
        </div>
    );
};
