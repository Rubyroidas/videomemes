import {ChangeEventHandler} from 'react';
import {useTranslation} from 'react-i18next';
import styled from '@emotion/styled';

import {consoleLog} from '../utils';
import {AnalyticsEvent, sendAnalyticsEvent} from '../services/analytics';

const Wrapper = styled.div`
    margin: 0 0 0 20px;

    @media (max-width: 480px) {
        margin: 0 0 0 5vw;
    }
`;

export const LanguageSelector = () => {
    const {i18n} = useTranslation();

    const currentLang = i18n.language;
    const langs = Object.keys(i18n.store.data);
    const handleSelect: ChangeEventHandler<HTMLSelectElement> = (e) => {
        const lang = e.target.value;
        consoleLog('save lang to localStorage', lang);
        localStorage.setItem('selectedLanguage', lang);
        i18n.changeLanguage(lang);
        sendAnalyticsEvent(AnalyticsEvent.Language_Changed, {
            lang,
        });
    };

    return (
        <Wrapper>
            <select onChange={handleSelect} value={currentLang}>
                {langs.map(lang => (
                    <option
                        value={lang}
                        key={lang}
                    >{lang}</option>
                ))}
            </select>
        </Wrapper>
    )
}
