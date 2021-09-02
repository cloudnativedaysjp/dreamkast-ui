import React from 'react'
import Button from '@material-ui/core/Button'
import * as Styled from './styled'
import * as CommonStyled from '../../styles/styled'

type Props = {
  url: string
}

export const DesktopMenu: React.FC<Props> = ({ url }) => {
  return (
    <Styled.DesktopMenu>
      <CommonStyled.MenuLink
        href="/cicd2021/ui/discussionboard"
        rel="noreferrer"
      >
        <Button style={{ color: '#423A57' }}>DiscussionBoard</Button>
      </CommonStyled.MenuLink>
      <CommonStyled.MenuLink href="/cicd2021/timetables" rel="noreferrer">
        <Button style={{ color: '#423A57' }}>Timetable</Button>
      </CommonStyled.MenuLink>
      <Button href={url} style={{ color: '#423A57' }}>
        Logout
      </Button>
    </Styled.DesktopMenu>
  )
}
