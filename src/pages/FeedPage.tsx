import {Link} from 'react-router-dom';

import {Feed} from '../components/Feed';
import {AppTitle, ListTitle} from '../components/App.styles';
import {HomeIcon} from '../icons/HomeIcon';

export const FeedPage = () => (
    <div>
        <AppTitle>
            <Link to="/">
                <HomeIcon/>
            </Link>
            Feed
        </AppTitle>
        <ListTitle>Users uploaded these videos</ListTitle>
        <Feed/>
    </div>
);
