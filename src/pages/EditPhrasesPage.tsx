import {Link, useNavigate} from 'react-router-dom';

import {VideoEditor} from '../components/VideoEditor';
import {AppTitle} from '../components/App.styles';
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
            <Link to="/">go home</Link>
            <AppTitle>Video meme generator</AppTitle>
            <VideoEditor/>
        </div>
    );
}
