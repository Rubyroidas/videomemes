import * as Sentry from '@sentry/react';

export const mountSentry = () => {
    Sentry.init({
        dsn: 'https://b49262b4c6ae25c337117354173db492@o4507006938972160.ingest.us.sentry.io/4507006944935936',
        beforeSend: event => {
            if (event.exception && event.event_id) {
                Sentry.showReportDialog({ eventId: event.event_id });
            }
            return event;
        },
        integrations: [
            Sentry.browserTracingIntegration(),
            Sentry.replayIntegration(),
            // Sentry.feedbackIntegration({
            //     // Additional SDK configuration goes in here, for example:
            //     colorScheme: 'system',
            // }),
        ],
        // Performance Monitoring
        tracesSampleRate: 1.0, //  Capture 100% of the transactions
        // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
        tracePropagationTargets: ['localhost', /^https:\/\/api\.memely\.net\/api/],
        // Session Replay
        replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
        replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
    });
};
