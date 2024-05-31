import {Link} from 'react-router-dom';
import {useTranslation} from 'react-i18next';

import {Feed} from '../components/Feed';
import {AppTitle, ListTitle} from '../components/App.styles';
import {HomeIcon} from '../icons/HomeIcon';
import {LanguageSelector} from '../components/LanguageSelector';

export const FeedPage = () => {
    const {t} = useTranslation();

    return (
        <div>
            <AppTitle>
                <Link to="/">
                    <HomeIcon/>
                </Link>
                {t('feed.title')}
                <LanguageSelector/>
            </AppTitle>
            <ListTitle>{t('feed.listTitle')}</ListTitle>
            <Feed/>
        </div>
    );
};
