import React, { ReactNode } from 'react'
import * as Styled from './styled'
import Head from 'next/head'
import Button from '@material-ui/core/Button'
import AppBar from '@material-ui/core/AppBar'

type Props = {
  children?: ReactNode
  title?: string
}

export const Layout: React.FC<Props> = ({
  children,
  title = 'This is the default title',
}) => {
  return (
    <Styled.Container>
      <Head>
        <title>{title}</title>
        <link rel="shortcut icon" href="/cndo2021/ui/trademark.svg" />
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <header>
        <AppBar position="static">
          <Styled.Header>
            <Styled.HeaderImg src="/cndo2021/ui/images/CNDO2021_horizontal.png" />
            <Button style={{ color: '#037f8c' }}>Login</Button>
          </Styled.Header>
        </AppBar>
      </header>
      <Styled.ChildrenContainer>{children}</Styled.ChildrenContainer>
      <Styled.Footer>
        <Styled.FooterLink href="https://event.cloudnativedays.jp/cndo2021/privacy">
          プライバシーポリシー
        </Styled.FooterLink>
        <Styled.FooterLink href="https://event.cloudnativedays.jp/cndo2021/coc">
          行動規範
        </Styled.FooterLink>
        <Styled.FooterText>
          © CloudNative Days Spring 2021 ONLINE (Secretariat by Impress
          Corporation)
        </Styled.FooterText>
      </Styled.Footer>
    </Styled.Container>
  )
}
