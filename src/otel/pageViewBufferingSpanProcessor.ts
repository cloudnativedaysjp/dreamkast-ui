import { Context, SpanStatusCode } from '@opentelemetry/api'
import {
  ReadableSpan,
  Span,
  SpanProcessor,
} from '@opentelemetry/sdk-trace-base'

const DEFAULT_MAX_BUFFERED_SPANS = 100

// page view(ページ表示〜次のページ遷移まで)単位でspanをメモリ上に蓄積し、
// ERRORなspanが1つでも現れたらそのpage view分をまとめて送信する。
// ERRORが一度も現れないままpage viewが終わったら、蓄積分は破棄しMackerelへは送らない。
//
// ブラウザのfetch/XHR等の計装は、明示的なroot spanへ長時間ぶら下げ続ける標準的な
// 手段を持たない(traceId/parent-childでのグルーピングが困難)ため、ここでは
// アプリ側(webTracing.ts、routeChangeStart等)から通知される「現在のpage view」の
// 世代番号でグルーピングする。ページ遷移の検知漏れはベストエフォートで許容し、
// 取りこぼしても無関係なspanが混入する程度に影響を留める(上限件数で頭打ちになる)。
export class PageViewBufferingSpanProcessor implements SpanProcessor {
  private readonly buffers = new Map<number, ReadableSpan[]>()
  private readonly flowing = new Set<number>()
  private generation = 0

  constructor(
    private readonly inner: SpanProcessor,
    private readonly maxBufferedSpans: number = DEFAULT_MAX_BUFFERED_SPANS,
  ) {}

  onStart(span: Span, parentContext: Context): void {
    this.inner.onStart(span, parentContext)
  }

  onEnd(span: ReadableSpan): void {
    const { generation } = this

    if (this.flowing.has(generation)) {
      this.inner.onEnd(span)
      return
    }

    const buffer = this.buffers.get(generation) ?? []
    buffer.push(span)
    while (buffer.length > this.maxBufferedSpans) {
      buffer.shift()
    }
    this.buffers.set(generation, buffer)

    if (span.status.code === SpanStatusCode.ERROR) {
      this.flowing.add(generation)
      for (const buffered of buffer) {
        this.inner.onEnd(buffered)
      }
      this.buffers.delete(generation)
    }
  }

  // 新しいpage viewの開始を通知する。ERRORが無いまま終わった直前のpage view分の
  // バッファは破棄する(既にflowing化してexport済みの分は影響を受けない)。
  beginNewPageView(): void {
    const previous = this.generation
    this.generation += 1
    this.buffers.delete(previous)
    this.flowing.delete(previous)
  }

  forceFlush(): Promise<void> {
    return this.inner.forceFlush()
  }

  shutdown(): Promise<void> {
    return this.inner.shutdown()
  }
}
