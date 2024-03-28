import {Link} from 'react-router-dom';

import {Feed} from '../components/Feed';
import {AppTitle} from '../components/App.styles';
import {HomeIcon} from '../icons/HomeIcon';

export const FeedPage = () => (
    <div>
        <AppTitle>
            <Link to="/">
                <HomeIcon/>
            </Link>
            Feed
        </AppTitle>
        <Feed/>
    </div>
);
