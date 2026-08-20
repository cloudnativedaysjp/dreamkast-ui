import { ZoneContextManager } from '@opentelemetry/context-zone'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'
import { registerInstrumentations } from '@opentelemetry/instrumentation'
import { DocumentLoadInstrumentation } from '@opentelemetry/instrumentation-document-load'
import { FetchInstrumentation } from '@opentelemetry/instrumentation-fetch'
import { XMLHttpRequestInstrumentation } from '@opentelemetry/instrumentation-xml-http-request'
import { Resource } from '@opentelemetry/resources'
import {
  AlwaysOnSampler,
  BatchSpanProcessor,
  WebTracerProvider,
} from '@opentelemetry/sdk-trace-web'
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions'
import { ErrorOnlySpanProcessor } from './errorOnlySpanProcessor'
import { recordExceptionOnActiveSpan } from './recordException'

let started = false
let provider: WebTracerProvider | undefined

// ブラウザからは中継用API Route(同一オリジン)経由でOTel Collectorへ送信する。
// Collectorのエンドポイントをブラウザに公開しないため。
const TRACES_RELAY_PATH = '/api/otel/traces'

// 未捕捉の例外をtraceに記録した直後にページ遷移/クラッシュしても送信されないことがあるため、
// 記録後にexporterへの送信を明示的にflushする(spanは終了させない)。
export async function flushPendingSpans(): Promise<void> {
  await provider?.forceFlush()
}

export function startWebTracing(): void {
  if (started || typeof window === 'undefined') {
    return
  }
  started = true

  const exportUrl = new URL(TRACES_RELAY_PATH, window.location.origin).href

  provider = new WebTracerProvider({
    resource: new Resource({
      [ATTR_SERVICE_NAME]: 'dreamkast-ui-web',
    }),
    // 送信するか否かの判断はErrorOnlySpanProcessorに一本化するため、サンプラーは
    // 全spanを記録対象にするAlwaysOnにする(サンプラーで捨てるとonEnd()に届かない)。
    sampler: new AlwaysOnSampler(),
    spanProcessors: [
      new ErrorOnlySpanProcessor(
        new BatchSpanProcessor(new OTLPTraceExporter({ url: exportUrl })),
      ),
    ],
  })

  provider.register({ contextManager: new ZoneContextManager() })

  registerInstrumentations({
    tracerProvider: provider,
    instrumentations: [
      new DocumentLoadInstrumentation(),
      new FetchInstrumentation(),
      new XMLHttpRequestInstrumentation(),
    ],
  })

  window.addEventListener('error', (event) => {
    recordExceptionOnActiveSpan(event.error ?? event.message)
  })
  window.addEventListener('unhandledrejection', (event) => {
    recordExceptionOnActiveSpan(event.reason)
  })
}
