import { Context, SpanStatusCode } from '@opentelemetry/api'
import {
  ReadableSpan,
  Span,
  SpanProcessor,
} from '@opentelemetry/sdk-trace-base'

// 仕様: エラーを含まないtraceは一切backendに送らない。エラーを含むtraceは、
// 少なくともエラーを表すspanは全て送る(trace全体を送っても構わないが、
// ここでは最小要件の「エラーspanのみ転送」を実装する)。
//
// そのため送信判定はサンプラーではなくexport直前のこのProcessorに一本化し、
// サンプラー自体はAlwaysOnにしてすべてのspanをonEnd()まで観測できるようにする。
export class ErrorOnlySpanProcessor implements SpanProcessor {
  constructor(private readonly inner: SpanProcessor) {}

  onStart(span: Span, parentContext: Context): void {
    this.inner.onStart(span, parentContext)
  }

  onEnd(span: ReadableSpan): void {
    if (span.status.code === SpanStatusCode.ERROR) {
      this.inner.onEnd(span)
    }
  }

  forceFlush(): Promise<void> {
    return this.inner.forceFlush()
  }

  shutdown(): Promise<void> {
    return this.inner.shutdown()
  }
}
