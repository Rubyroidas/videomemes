import {Link} from 'react-router-dom';
import {useTranslation} from 'react-i18next';

import {Feed} from '../components/Feed';
import {AppTitle, ListTitle} from '../components/App.styles';
import {LanguageSelector} from '../components/LanguageSelector';
import {HomeIcon} from '../icons/HomeIcon';

export const FeedPage = () => {
    const {t} = useTranslation();

    return (
        <div>
            <LanguageSelector/>
            <AppTitle>
                <Link to="/">
                    <HomeIcon/>
                </Link>
                {t('feed.title')}
            </AppTitle>
            <ListTitle>Users uploaded these videos</ListTitle>
            <Feed/>
        </div>
    );
};
