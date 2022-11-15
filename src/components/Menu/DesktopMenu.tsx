import React from 'react'
import Button from '@material-ui/core/Button'
import * as Styled from './styled'
import * as CommonStyled from '../../styles/styled'
import { Event } from '../../generated/dreamkast-api.generated'
import { TrailMapModal } from '../TrailMap/TrailMapModal'

type Props = {
  event?: Event
  url: string
}

export const DesktopMenu: React.FC<Props> = ({ event, url }) => {
  return (
    <Styled.DesktopMenu>
      <TrailMapModal />
      <CommonStyled.MenuLink href={`/${event?.abbr}/o11y`} rel="noreferrer">
        <Button style={{ color: '#423A57' }}>Grafana</Button>
      </CommonStyled.MenuLink>
      <CommonStyled.MenuLink
        href={`/${event?.abbr}/timetables`}
        rel="noreferrer"
      >
        <Button style={{ color: '#423A57' }}>Timetable</Button>
      </CommonStyled.MenuLink>
      <Button href={url} style={{ color: '#423A57' }}>
        Logout
      </Button>
    </Styled.DesktopMenu>
  )
}
