const Sentry = require('@sentry/node');

Sentry.init({
  environment: process.env.NODE_ENV,
  dsn: process.env.SENTRY_DSN,
  integrations: [
    Sentry.httpIntegration({ tracing: true }),
    Sentry.expressIntegration({ app: require('express') })
  ],
  tracesSampleRate: 1.0
});
