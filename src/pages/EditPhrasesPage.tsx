import {Link, useNavigate} from 'react-router-dom';

import {VideoEditor} from '../components/PhrasesEditor/VideoEditor';
import {AppTitle} from '../components/App.styles';
import {useEffect} from 'react';
import {useStore} from '../store';
import {HomeIcon} from '../icons/HomeIcon';

export const EditPhrasesPage = () => {
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
                Video meme generator
            </AppTitle>
            <VideoEditor/>
        </div>
    );
};
