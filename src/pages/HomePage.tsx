import {useTranslation} from 'react-i18next';

import {Button, Header, LinksList, MinorLink, Paragraph} from './HomePage.styles';

export const HomePage = () => {
    const {t} = useTranslation();

    return (
        <div>
            <Header>
                Memely.net
            </Header>
            <Paragraph>
                {t('mainPage.title')}
            </Paragraph>
            <LinksList>
                <Button to="/new-scenario?from=preset">{t('mainPage.menuButtons.choosePreset')}</Button>
                <Button to="/new-scenario">{t('mainPage.menuButtons.createFromScratch')}</Button>
                <Button to="/feed">{t('mainPage.menuButtons.gotoFeed')}</Button>
            </LinksList>
            <LinksList>
                <MinorLink to="/about">{t('mainPage.menuButtons.about')}</MinorLink>
                <MinorLink to="https://jq6tjtcmc5w.typeform.com/to/BFJ4VAXs" target="_blank">{t('mainPage.menuButtons.contactUs')}</MinorLink>
                {/*<MinorLink to="/donate">Donate for development</MinorLink>*/}
            </LinksList>
            <button onClick={() => {
                throw new Error('I am an error');
            }}>break it</button>
        </div>
    );
};
