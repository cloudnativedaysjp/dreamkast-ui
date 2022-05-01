import React, { ReactNode, useEffect, useState } from 'react'
import * as Styled from './styled'
import Head from 'next/head'
import { DesktopMenu, MobileMenu } from '../Menu'
import AppBar from '@material-ui/core/AppBar'
import { Event } from '../../client-axios'

type Props = {
  children?: ReactNode
  title?: string
  event?: Event
}

export const Layout: React.FC<Props> = ({
  children,
  title = 'This is the default title',
  event,
}) => {
  const [url, setUrl] = useState<string>('')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setUrl(window.location.origin + '/logout')
    }
  }, [])

  return (
    <Styled.Container eventAbbr={event?.abbr}>
      <Head>
        <title>{title}</title>
        <link
          rel="shortcut icon"
          href={`/${event?.abbr}/ui/${event?.abbr}_trademark.png`}
        />
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <header>
        <AppBar position="static">
          <Styled.Header>
            <a href={`/${event?.abbr}/ui`} rel="noopener noreferrer">
              <Styled.HeaderImg
                src={`/${event?.abbr}/ui/${event?.abbr}_header_logo.png`}
              />
            </a>
            <DesktopMenu event={event} url={url} />
          </Styled.Header>
          <MobileMenu event={event} url={url} />
        </AppBar>
      </header>
      <Styled.ChildrenContainer>{children}</Styled.ChildrenContainer>
      <Styled.Footer>
        <Styled.FooterLink
          href={`https://event.cloudnativedays.jp/${event?.abbr}/privacy`}
          target="_blank"
          rel="noopener noreferrer"
        >
          プライバシーポリシー
        </Styled.FooterLink>
        <Styled.FooterLink
          href={`https://event.cloudnativedays.jp/${event?.abbr}/coc`}
          target="_blank"
          rel="noopener noreferrer"
        >
          行動規範
        </Styled.FooterLink>
        <Styled.FooterText>{event?.copyright}</Styled.FooterText>
      </Styled.Footer>
    </Styled.Container>
  )
}
