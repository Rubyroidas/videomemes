import {useNavigate} from 'react-router-dom';

import {VideoEditor} from '../components/VideoEditor';
import {AppTitle, BasicLink} from '../components/App.styles';
import {useEffect} from 'react';
import {useStore} from '../store';
import {Format} from '../types.ts';

export const EditPhrasesPage = () => {
    const navigate = useNavigate();
    const store = useStore();
    useEffect(() => {
        if (!store.scenario) {
            store.scenario = {
                format: Format.InstagramStory,
                phrases: [],
            };
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
}
