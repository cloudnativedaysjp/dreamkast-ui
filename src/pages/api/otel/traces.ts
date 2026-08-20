import { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

const RATE_LIMIT_WINDOW_MS = 60_000
const RATE_LIMIT_MAX_REQUESTS = 120
const MAX_TRACKED_CLIENTS = 10_000
const hitsByClient = new Map<string, { count: number; windowStart: number }>()

// Mapは既存キーへのset()では挿入順(=末尾)を更新しないため、触れたキーは必ず
// delete→setし直して最新アクセスを末尾に押し出す。これによりevictionが本当の
// LRU(最終アクセスが古いものから間引く)になり、アクティブなクライアントが
// 誤って最古と判定されて先に間引かれることを防ぐ。
function touch(
  clientKey: string,
  entry: { count: number; windowStart: number },
): void {
  hitsByClient.delete(clientKey)
  hitsByClient.set(clientKey, entry)
}

// Collectorへ好きなだけリクエストを送れないよう、クライアント単位で簡易にレート制限する。
// 複数インスタンスには跨がらないベストエフォートの防御であり、正式なレート制限の代替ではない。
function isRateLimited(clientKey: string): boolean {
  const now = Date.now()
  const entry = hitsByClient.get(clientKey)
  if (!entry || now - entry.windowStart >= RATE_LIMIT_WINDOW_MS) {
    touch(clientKey, { count: 1, windowStart: now })
    if (hitsByClient.size > MAX_TRACKED_CLIENTS) {
      for (const [key, value] of hitsByClient) {
        if (now - value.windowStart >= RATE_LIMIT_WINDOW_MS) {
          hitsByClient.delete(key)
        }
      }
      // 掃除後もLRUの挿入順で上限を超えていれば、最終アクセスが古い順に強制間引く
      while (hitsByClient.size > MAX_TRACKED_CLIENTS) {
        const oldestKey = hitsByClient.keys().next().value
        if (oldestKey === undefined) {
          break
        }
        hitsByClient.delete(oldestKey)
      }
    }
    return false
  }
  entry.count += 1
  touch(clientKey, entry)
  return entry.count > RATE_LIMIT_MAX_REQUESTS
}

// X-Forwarded-Forはクライアントが自由に偽装できるため使わない。nginx(nginx/lb.conf)は
// $remote_addrを上書きしてX-Real-IPを付与するため、これを信頼できる実IPとして使う。
function resolveClientKey(req: NextApiRequest): string {
  const realIp = req.headers['x-real-ip']
  const first = Array.isArray(realIp) ? realIp[0] : realIp
  return first || req.socket.remoteAddress || 'unknown'
}

// このAPIは自オリジンのブラウザ計装からのみ呼ばれる想定。Origin/Refererが自オリジンと
// 一致しない場合は、Collectorへの踏み台として使われるのを防ぐために拒否する。
function isSameOrigin(req: NextApiRequest): boolean {
  const proto = (req.headers['x-forwarded-proto'] as string) ?? 'http'
  const host = req.headers.host
  if (!host) {
    return false
  }
  const selfOrigin = `${proto}://${host}`

  const origin = req.headers.origin
  if (origin) {
    return origin === selfOrigin
  }

  const referer = req.headers.referer
  return typeof referer === 'string' && referer.startsWith(`${selfOrigin}/`)
}

// ブラウザからのOTLP/HTTP(JSON) trace送信を、同一オリジンで中継してOTel Collectorへ転送する。
// CollectorのURLや資格情報をブラウザに露出させないための同一オリジンプロキシ。
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method Not Allowed')
    return
  }

  if (!isSameOrigin(req)) {
    res.status(403).end('Forbidden')
    return
  }

  if (isRateLimited(resolveClientKey(req))) {
    res.status(429).end('Too Many Requests')
    return
  }

  const endpoint = process.env.OTEL_EXPORTER_OTLP_ENDPOINT
  if (!endpoint) {
    // eslint-disable-next-line no-console
    console.warn(
      '[otel] OTEL_EXPORTER_OTLP_ENDPOINT is not set. Dropping relayed browser trace.',
    )
    res.status(204).end()
    return
  }

  try {
    await axios.post(`${endpoint.replace(/\/$/, '')}/v1/traces`, req.body, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 5000,
    })
    res.status(204).end()
  } catch {
    // Collectorへの送信失敗はクライアントの動作に影響させない
    res.status(202).end()
  }
}
