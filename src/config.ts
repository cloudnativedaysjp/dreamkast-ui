export const ENV = {
  NEXT_PUBLIC_AUTH0_DOMAIN: process.env.NEXT_PUBLIC_AUTH0_DOMAIN ?? '',
  NEXT_PUBLIC_AUTH0_CLIENT_ID: process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID ?? '',
  NEXT_PUBLIC_AUTH0_AUDIENCE: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE ?? '',
  NEXT_PUBLIC_BASE_PATH: process.env.NEXT_PUBLIC_BASE_PATH ?? '',
  NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL ?? '',
  NEXT_PUBLIC_WEAVER_URL: process.env.NEXT_PUBLIC_WEAVER_URL ?? '',
  NEXT_PUBLIC_DK_URL:
    process.env.NEXT_PUBLIC_DK_URL ??
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    '',
  NEXT_PUBLIC_EVENT_SALT:
    process.env.NEXT_PUBLIC_EVENT_SALT ?? 'cloudnativedays',
} as const

export function validateEnv() {
  const requiredEnvVars = [
    'NEXT_PUBLIC_AUTH0_DOMAIN',
    'NEXT_PUBLIC_AUTH0_CLIENT_ID',
    'NEXT_PUBLIC_AUTH0_AUDIENCE',
    'NEXT_PUBLIC_BASE_PATH',
    'NEXT_PUBLIC_API_BASE_URL',
    'NEXT_PUBLIC_WEAVER_URL',
  ]

  for (const v of requiredEnvVars) {
    if (!process.env[v]) {
      throw new Error(`Environment Variable "${v}" must be supplied.`)
    }
  }
}
