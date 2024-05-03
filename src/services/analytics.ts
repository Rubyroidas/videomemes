import * as amplitude from '@amplitude/analytics-browser';

import {consoleLog} from '../utils';

amplitude.init('2232c1e3d7a0f750d9304f61d86c1ef9');

export const sendAnalyticsEvent = (event: Lowercase<string>, data: Record<Lowercase<string>, any> = {}) => {
    const page = window.location.pathname;
    const eventParams: Record<Lowercase<string>, any> = {
        page,
        build: __VER__,
        ...data,
    };
    consoleLog('sendAnalyticsEvent', event, eventParams);
    if (!__DEV__) {
        amplitude.logEvent(event, eventParams);
    }
};
