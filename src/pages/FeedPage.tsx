import {Feed} from '../components/Feed';
import {AppTitle, BasicLink} from '../components/App.styles.tsx';

export const FeedPage = () => (
    <div>
        <BasicLink to="/">go home</BasicLink>
        <AppTitle>Feed</AppTitle>
        <Feed/>
    </div>
);
