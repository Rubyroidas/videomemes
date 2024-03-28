import {useEffect} from 'react';
import {observer} from 'mobx-react';
import {Link, useNavigate} from 'react-router-dom';

import {AppTitle} from '../components/App.styles';
import {TitleSetup} from '../components/TitleSetup';
import {useStore} from '../store';
import {HomeIcon} from '../icons/HomeIcon';

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
            <AppTitle>
                <Link to="/">
                    <HomeIcon/>
                </Link>
                Do you want video to have a title?
            </AppTitle>
            <TitleSetup/>
        </div>
    );
});
