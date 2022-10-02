const requiredEnvVars = [
  'NEXT_PUBLIC_AUTH0_DOMAIN',
  'NEXT_PUBLIC_AUTH0_CLIENT_ID',
  'NEXT_PUBLIC_BASE_PATH',
  'NEXT_PUBLIC_API_BASE_URL',
  'NEXT_PUBLIC_AUDIENCE',
]

for (let v of requiredEnvVars) {
  if (!process.env[v]) {
    throw new Error(`Environment Variable "${v}" must be supplied.`)
  }
}

module.exports = {}
