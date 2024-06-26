import React, { ReactNode } from 'react'
import * as Styled from './styled'
import Head from 'next/head'
import { DesktopMenu, MobileMenu } from '../Menu'
import AppBar from '@material-ui/core/AppBar'
import { Event } from '../../generated/dreamkast-api.generated'
import Link from 'next/link'
import { useSelector } from 'react-redux'
import { authSelector } from '../../store/auth'

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
  const { roles } = useSelector(authSelector)
  const isAdminRole = roles.includes(`${event?.abbr.toUpperCase()}-Admin`)

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
          <Styled.Header isRehearsal={event?.rehearsalMode}>
            <Link href={`/${event?.abbr}/ui`} rel="noopener noreferrer">
              <Styled.HeaderImg
                src={`/${event?.abbr}/ui/${event?.abbr}_header_logo.png`}
              />
            </Link>
            <MobileMenu event={event} isAdminRole={isAdminRole} />
            <DesktopMenu event={event} />
          </Styled.Header>
        </AppBar>
      </header>
      {/* TODO: TrailMapを使わない判断がされたら、TrailMap関連の処理を消す  */}
      {/* <TrailMapModal>
        <TrailMap />
      </TrailMapModal> */}
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
