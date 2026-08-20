/**
 * This page is loaded by Nextjs:
 *  - on the server, when data-fetching methods throw or reject
 *  - on the client, when `getInitialProps` throws or rejects
 *  - on the client, when a React lifecycle method throws or rejects, and it's
 *    caught by the built-in Nextjs error boundary
 *
 * See:
 *  - https://nextjs.org/docs/basic-features/data-fetching/overview
 *  - https://nextjs.org/docs/api-reference/data-fetching/get-initial-props
 *  - https://reactjs.org/docs/error-boundaries.html
 */

import NextErrorComponent from 'next/error'
import { NextPageContext } from 'next'
import { ErrorLayout } from '../components/Layout/ErrorLayout'
import { recordExceptionAndFlush } from '../otel/recordException'

type Props = {
  statusCode?: number
}

const CustomErrorComponent = (props: Props) => {
  return <ErrorLayout statusCode={props.statusCode} />
}

CustomErrorComponent.getInitialProps = async (contextData: NextPageContext) => {
  if (contextData.err) {
    // レスポンスが返る/ページが遷移する前にexportを待ち、テレメトリの欠落を防ぐ
    await recordExceptionAndFlush(contextData.err)
  }

  // This will contain the status code of the response
  return NextErrorComponent.getInitialProps(contextData)
}

export default CustomErrorComponent
