import React, { useState } from 'react'
import Head from 'next/head'

const boxStyles = {
  padding: '12px',
  border: '1px solid #eaeaea',
  borderRadius: '10px',
}

// 開発環境でOTelのエラー計装(ErrorBoundary/window.onerror/unhandledrejection)が
// 動作し、Mackerelへtraceが送信されることを手動で確認するためのページ。
// 本番では利用しない想定。
const ThrowOnRender = () => {
  throw new Error('OTel Sample Render Error')
}

export default function OtelSampleError() {
  const [shouldThrowOnRender, setShouldThrowOnRender] = useState(false)

  return (
    <div>
      <Head>
        <title>OTel Sample Error</title>
        <meta
          name="description"
          content="Verify OpenTelemetry error capture manually"
        />
      </Head>

      <main
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <h1>OTel Sample Error</h1>
        <p>
          各ボタンで意図的にエラーを発生させ、Mackerelへtraceが送信されることを
          確認できます(NEXT_PUBLIC_MACKEREL_CLIENT_TOKENが設定されている必要があります)。
        </p>

        <button
          type="button"
          style={{ ...boxStyles, backgroundColor: '#f5a623', border: 'none' }}
          onClick={() => {
            // イベントハンドラ内の例外はwindow.addEventListener('error', ...)で捕捉される。
            throw new Error('OTel Sample Event Handler Error')
          }}
        >
          Throw in event handler
        </button>

        <button
          type="button"
          style={{ ...boxStyles, backgroundColor: '#c73852', border: 'none' }}
          onClick={() => {
            // レンダリング中の例外はErrorBoundary(componentDidCatch)で捕捉される。
            setShouldThrowOnRender(true)
          }}
        >
          Throw during render
        </button>

        <button
          type="button"
          style={{ ...boxStyles, backgroundColor: '#4a90d9', border: 'none' }}
          onClick={() => {
            // 未処理のPromise rejectionはwindow.addEventListener('unhandledrejection', ...)で捕捉される。
            Promise.reject(new Error('OTel Sample Unhandled Rejection'))
          }}
        >
          Reject promise
        </button>

        {shouldThrowOnRender && <ThrowOnRender />}
      </main>
    </div>
  )
}
