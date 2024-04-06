import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';

import {consoleLog} from './utils';
import {en, uk} from './translations';

const resources = {
    en: {
        translation: en,
    },
    uk: {
        translation: uk,
    },
};

let lng = 'en';
const supportedLangs = Object.keys(resources);
const savedLanguage = localStorage.getItem('selectedLanguage')
if (savedLanguage && supportedLangs.includes(savedLanguage)) {
    consoleLog('load lang from localStorage', savedLanguage);
    lng = savedLanguage;
} else {
    const userLangs = navigator.languages.map(l => l.match(/^(\w{2})/)![1]);
    for (const userLang of userLangs) {
        if (supportedLangs.includes(userLang)) {
            consoleLog('user language preference', savedLanguage);
            lng = userLang;
            break;
        }
    }
}

i18n
    .use(initReactI18next)
    .init({
        lng,
        debug: __DEV__,
        defaultNS: 'translation',
        resources,
        fallbackLng: 'en',

        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
