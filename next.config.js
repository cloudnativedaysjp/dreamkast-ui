const nextConfig = {
  experimental: {
    instrumentationHook: true,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // recordExceptionAndFlush()はサーバー用/ブラウザ用のtracingモジュールを
      // 動的importで出し分けるが、webpackはビルド時に両方の依存を解決しようとする。
      // サーバー専用モジュール(@opentelemetry/sdk-trace-node等)が使うNode組み込みを
      // クライアントビルドではダミー化し、実際には実行されない分岐の解決失敗を防ぐ。
      config.resolve.fallback = {
        ...config.resolve.fallback,
        async_hooks: false,
      }
    }
    return config
  },
}

module.exports = nextConfig
