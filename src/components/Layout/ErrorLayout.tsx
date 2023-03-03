import React from 'react'
import * as Styled from './styled'
import Head from 'next/head'
import AppBar from '@material-ui/core/AppBar'
import Link from 'next/link'
import { useRouter } from 'next/router'

type Props = {
  statusCode?: number
}

export const ErrorLayout = ({ statusCode }: Props) => {
  const router = useRouter()
  const eventAbbr = (() => {
    const { eventAbbr } = router.query
    return router.isReady ? (eventAbbr as string) : ''
  })()

  return (
    <Styled.Container eventAbbr={eventAbbr}>
      <Head>
        <title>Error: CloudNative Days player</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <header>
        <AppBar position="static">
          <Styled.Header>
            <Link href={`/${eventAbbr}/ui`} rel="noopener noreferrer">
              <Styled.HeaderImg
                src={`/${eventAbbr}/ui/${eventAbbr}_header_logo.png`}
              />
            </Link>
          </Styled.Header>
        </AppBar>
      </header>
      <Styled.ErrorContainer>
        <Styled.ErrorMessage>
          {statusCode || ''} エラーが発生しました。
          <br />
          リロードしても問題が継続する場合は、スタッフまでお問い合わせください。
        </Styled.ErrorMessage>
      </Styled.ErrorContainer>
    </Styled.Container>
  )
}
