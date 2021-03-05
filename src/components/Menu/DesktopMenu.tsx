import React from 'react'
import Button from '@material-ui/core/Button'
import * as Styled from './styled'

type Props = {
  url: string
}

export const DesktopMenu: React.FC<Props> = ({ url }) => {
  return (
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
  )
}
