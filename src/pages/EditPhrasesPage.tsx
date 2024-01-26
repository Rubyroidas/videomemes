import {useNavigate} from 'react-router-dom';

import {VideoEditor} from '../components/PhrasesEditor/VideoEditor';
import {AppTitle, BasicLink} from '../components/App.styles';
import {useEffect} from 'react';
import {useStore} from '../store';

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
            <BasicLink to="/">go home</BasicLink>
            <AppTitle>Video meme generator</AppTitle>
            <VideoEditor/>
        </div>
    );
};
