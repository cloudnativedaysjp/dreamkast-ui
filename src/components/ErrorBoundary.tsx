import React, { Component, ErrorInfo, PropsWithChildren } from 'react'
import { ErrorLayout } from './Layout/ErrorLayout'
import { recordExceptionOnActiveSpan } from '../otel/recordException'

type State = {
  hasError: boolean
}

// Next.jsの_error.tsxはgetInitialPropsが投げた例外/SSRエラーしか捕捉できないため、
// クライアント側のレンダリング中の例外はReactのError Boundaryで捕捉してtraceに記録する。
export class ErrorBoundary extends Component<PropsWithChildren, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    recordExceptionOnActiveSpan(error)
    // eslint-disable-next-line no-console
    console.error(error, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      return <ErrorLayout />
    }
    return this.props.children
  }
}
