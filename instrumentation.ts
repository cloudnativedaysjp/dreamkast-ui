import * as Sentry from '@sentry/nextjs'

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN

const sentryOptions = {
  dsn:
    SENTRY_DSN ||
    'https://144c5d72cbf1da0931ff09532d25b11d@o414348.ingest.us.sentry.io/4509089547747328',
  tracesSampleRate: 0.5,
  sampleRate: 0.5,
}

export async function register() {
  if (
    process.env.NEXT_RUNTIME === 'nodejs' ||
    process.env.NEXT_RUNTIME === 'edge'
  ) {
    Sentry.init(sentryOptions)
  }
}

export const onRequestError = Sentry.captureRequestError
