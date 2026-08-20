export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { startNodeTracing } = await import('./otel/nodeTracing')
    startNodeTracing()
  }
}
