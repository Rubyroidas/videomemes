import {useEffect} from 'react';
import {observer} from 'mobx-react';
import {useNavigate} from 'react-router-dom';

import {AppTitle, BasicLink} from '../components/App.styles';
import {TitleSetup} from '../components/TitleSetup';
import {useStore} from '../store';

export const TitleSetupPage = observer(() => {
    const store = useStore();
    const navigate = useNavigate();

    useEffect(() => {
        if (!store.scenario) {
            navigate('/');
        }
    }, []);

    if (!store.scenario) {
        return null;
    }

    return (
        <div>
            <BasicLink to="/">go home</BasicLink>
            <AppTitle>Do you want video to have a title?</AppTitle>
            <TitleSetup/>
        </div>
    );
});
