import { ZoneContextManager } from '@opentelemetry/context-zone'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto'
import { registerInstrumentations } from '@opentelemetry/instrumentation'
import { DocumentLoadInstrumentation } from '@opentelemetry/instrumentation-document-load'
import { FetchInstrumentation } from '@opentelemetry/instrumentation-fetch'
import { XMLHttpRequestInstrumentation } from '@opentelemetry/instrumentation-xml-http-request'
import { resourceFromAttributes } from '@opentelemetry/resources'
import {
  AlwaysOnSampler,
  BatchSpanProcessor,
  WebTracerProvider,
} from '@opentelemetry/sdk-trace-web'
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions'

// Mackerelのトレース収集エンドポイント。クライアントトークンは投稿権限のみに
// スコープされているため、フロントエンドのコードに直接埋め込む設計になっている。
// https://mackerel.io/ja/docs/entry/tracing/installations/browser
const MACKEREL_TRACES_ENDPOINT = 'https://otlp-vaxila.mackerelio.com/v1/traces'

let started = false
let provider: WebTracerProvider | undefined

// 未捕捉の例外をtraceに記録した直後にページ遷移/クラッシュしても送信されないことがあるため、
// 記録後にexporterへの送信を明示的にflushする(spanは終了させない)。
export async function flushPendingSpans(): Promise<void> {
  await provider?.forceFlush()
}

export function startWebTracing(): void {
  if (started || typeof window === 'undefined') {
    return
  }

  const clientToken = process.env.NEXT_PUBLIC_MACKEREL_CLIENT_TOKEN
  if (!clientToken) {
    // eslint-disable-next-line no-console
    console.warn(
      '[otel] NEXT_PUBLIC_MACKEREL_CLIENT_TOKEN is not set. Trace capture is disabled.',
    )
    return
  }
  started = true

  const exporter = new OTLPTraceExporter({
    url: MACKEREL_TRACES_ENDPOINT,
    headers: { 'X-Mackerel-Client-Token': clientToken },
  })

  provider = new WebTracerProvider({
    resource: resourceFromAttributes({
      [ATTR_SERVICE_NAME]: 'dreamkast-ui-web',
    }),
    // 送信するか否かの判断は別途導入するSpanProcessorに一本化する予定のため、
    // サンプラーは全spanを記録対象にするAlwaysOnにする(サンプラーで捨てるとonEnd()に届かない)。
    sampler: new AlwaysOnSampler(),
    // TODO(#606): 現時点では全spanを送信している。error spanを含むpage-viewの
    // spanのみをまとめて送るtail bufferingのSpanProcessorに置き換える予定。
    spanProcessors: [new BatchSpanProcessor(exporter)],
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
}
