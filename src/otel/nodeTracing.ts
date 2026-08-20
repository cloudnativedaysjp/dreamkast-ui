import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'
import { registerInstrumentations } from '@opentelemetry/instrumentation'
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http'
import { Resource } from '@opentelemetry/resources'
import {
  AlwaysOnSampler,
  BatchSpanProcessor,
} from '@opentelemetry/sdk-trace-base'
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node'
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions'
import { ErrorOnlySpanProcessor } from './errorOnlySpanProcessor'
import { recordExceptionOnActiveSpan } from './recordException'

// shutdown/flushがCollector無応答等でハングした場合でも処理を先に進めるための上限。
const SHUTDOWN_TIMEOUT_MS = 3_000

function withTimeout(promise: Promise<unknown>): Promise<unknown> {
  return Promise.race([
    promise,
    new Promise((resolve) => setTimeout(resolve, SHUTDOWN_TIMEOUT_MS)),
  ]).catch(() => undefined)
}

let provider: NodeTracerProvider | undefined

// 未捕捉の例外をtraceに記録した直後にプロセスがexit/クラッシュしても送信されないことがあるため、
// 記録後にexporterへの送信を明示的にflushする(spanは終了させない)。
export async function flushPendingSpans(): Promise<void> {
  if (!provider) {
    return
  }
  await withTimeout(provider.forceFlush())
}

let started = false

export function startNodeTracing(): void {
  if (started) {
    return
  }
  started = true

  const endpoint = process.env.OTEL_EXPORTER_OTLP_ENDPOINT
  if (!endpoint) {
    // eslint-disable-next-line no-console
    console.warn(
      '[otel] OTEL_EXPORTER_OTLP_ENDPOINT is not set. Server-side tracing and error capture are disabled.',
    )
    return
  }

  provider = new NodeTracerProvider({
    resource: new Resource({
      [ATTR_SERVICE_NAME]: process.env.OTEL_SERVICE_NAME ?? 'dreamkast-ui',
    }),
    // 送信するか否かの判断はErrorOnlySpanProcessorに一本化するため、サンプラーは
    // 全spanを記録対象にするAlwaysOnにする(サンプラーで捨てるとonEnd()に届かない)。
    sampler: new AlwaysOnSampler(),
    spanProcessors: [
      new ErrorOnlySpanProcessor(
        new BatchSpanProcessor(
          new OTLPTraceExporter({
            url: `${endpoint.replace(/\/$/, '')}/v1/traces`,
          }),
        ),
      ),
    ],
  })
  provider.register()

  registerInstrumentations({
    tracerProvider: provider,
    instrumentations: [new HttpInstrumentation()],
  })

  // NOTE: Next.jsのstart-server.jsは同じイベントに自前のuncaughtException/unhandledRejection
  // ハンドラを既に登録しており、1リクエストの例外で共有サーバープロセス全体を落とさず生かし続ける
  // 設計になっている。ここではその方針を変えず、traceへの記録とflushだけを行いprocess.exitはしない。
  process.on('uncaughtException', (error) => {
    recordExceptionOnActiveSpan(error)
    void flushPendingSpans()
  })
  process.on('unhandledRejection', (reason) => {
    recordExceptionOnActiveSpan(reason)
    void flushPendingSpans()
  })

  process.on('SIGTERM', () => {
    void (provider && withTimeout(provider.shutdown()))
  })
}
