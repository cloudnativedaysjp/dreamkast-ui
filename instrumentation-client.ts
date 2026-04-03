import * as Sentry from '@sentry/nextjs'
import { replayIntegration } from '@sentry/browser'

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN

Sentry.init({
  dsn:
    SENTRY_DSN ||
    'https://144c5d72cbf1da0931ff09532d25b11d@o414348.ingest.us.sentry.io/4509089547747328',
  tracesSampleRate: 0.5,
  sampleRate: 0.5,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  integrations: [replayIntegration()],
})

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart
