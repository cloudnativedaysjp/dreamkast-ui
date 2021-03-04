import React, { ReactNode, useEffect, useState } from 'react'
import * as Styled from './styled'
import Head from 'next/head'
import Button from '@material-ui/core/Button'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import AppBar from '@material-ui/core/AppBar'

type Props = {
  children?: ReactNode
  title?: string
}

export const Layout: React.FC<Props> = ({
  children,
  title = 'This is the default title',
}) => {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setUrl(`${window.location.href.replace('/cndo2021/ui', '/logout')}`)
    }
  }, [])

  const [url, setUrl] = useState<string>('')
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

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
            <a href="/cndo2021" target="_blank" rel="noopener noreferrer">
              <Styled.HeaderImg src="/cndo2021/ui/images/CNDO2021_horizontal.png" />
            </a>
            <Styled.DesktopMenu>
              <Styled.MenuLink href="#booths" rel="noreferrer">
                <Button style={{ color: '#037f8c' }}>Booths</Button>
              </Styled.MenuLink>
              <Styled.MenuLink
                href="/cndo2021/timetables"
                target="_blank"
                rel="noreferrer"
              >
                <Button style={{ color: '#037f8c' }}>Timetable</Button>
              </Styled.MenuLink>
              <Button href={url} style={{ color: '#037f8c' }}>
                Logout
              </Button>
            </Styled.DesktopMenu>
            <Styled.MobileMenu>
              <Button
                aria-controls="simple-menu"
                aria-haspopup="true"
                onClick={handleClick}
              >
                Open Menu
              </Button>
              <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleClose}>
                  <a href={'#booths'}>Booths</a>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                  <a href={'/cndo2021/timetables'}>Timetable</a>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                  <a href={url}>Logout</a>
                </MenuItem>
              </Menu>
            </Styled.MobileMenu>
          </Styled.Header>
        </AppBar>
      </header>
      <Styled.ChildrenContainer>{children}</Styled.ChildrenContainer>
      <Styled.Footer>
        <Styled.FooterLink
          href="https://event.cloudnativedays.jp/cndo2021/privacy"
          target="_blank"
          rel="noopener noreferrer"
        >
          プライバシーポリシー
        </Styled.FooterLink>
        <Styled.FooterLink
          href="https://event.cloudnativedays.jp/cndo2021/coc"
          target="_blank"
          rel="noopener noreferrer"
        >
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
