import {Link} from 'react-router-dom';

import {VideoEditor} from '../components/VideoEditor';
import {AppTitle} from '../components/App.styles';

export const EditPhrasesPage = () => (
    <div>
        <Link to="/">go home</Link>
        <AppTitle>Video meme generator</AppTitle>
        <VideoEditor/>
    </div>
);
