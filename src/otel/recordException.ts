import { SpanStatusCode, trace } from '@opentelemetry/api'

// アクティブなspanが無い場合は新規spanを作成して即時終了する。
// message/stacktraceはspan.recordException()が渡されたErrorの.message/.stackから
// 自動でexception.message/exception.stacktrace属性に載せる(SDK標準動作)。
export function recordExceptionOnActiveSpan(error: unknown): void {
  const err = error instanceof Error ? error : new Error(String(error))
  const activeSpan = trace.getActiveSpan()

  if (activeSpan) {
    activeSpan.recordException(err)
    activeSpan.setStatus({ code: SpanStatusCode.ERROR, message: err.message })
    return
  }

  const tracer = trace.getTracer('dreamkast-ui.error')
  const span = tracer.startSpan('unhandled-exception')
  span.recordException(err)
  span.setStatus({ code: SpanStatusCode.ERROR, message: err.message })
  span.end()
}

// _error.tsxのgetInitialProps等、記録直後にページが遷移しうる箇所で使う。
// webTracing.tsとの循環importを避けるため動的importにする。
export async function recordExceptionAndFlush(error: unknown): Promise<void> {
  recordExceptionOnActiveSpan(error)
  const { flushPendingSpans } = await import('./webTracing')
  await flushPendingSpans()
}
