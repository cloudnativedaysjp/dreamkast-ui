import { SpanStatusCode, trace } from '@opentelemetry/api'

// サーバー・ブラウザの両方から呼べる共通の例外記録ヘルパー。
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

// _error.tsxのgetInitialProps等、記録直後にプロセス/ページが終了しうる箇所で使う。
// レスポンスを返す前にexportを待ち、テレメトリのサイレントな欠落を防ぐ。
export async function recordExceptionAndFlush(error: unknown): Promise<void> {
  recordExceptionOnActiveSpan(error)
  if (typeof window === 'undefined') {
    const { flushPendingSpans } = await import('./nodeTracing')
    await flushPendingSpans()
  } else {
    const { flushPendingSpans } = await import('./webTracing')
    await flushPendingSpans()
  }
}
