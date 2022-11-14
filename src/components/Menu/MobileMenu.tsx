import React from 'react'
import Button from '@material-ui/core/Button'
import * as Styled from './styled'
import * as CommonStyled from '../../styles/styled'
import { Event } from '../../generated/dreamkast-api.generated'
import Link from 'next/link'
import { TrailMapButton } from '../TrailMap/TrailMapButton'

type Props = {
  event?: Event
  url: string
}

export const MobileMenu: React.FC<Props> = ({ event, url }) => {
  return (
    <Styled.MobileMenu>
      <Link href={`/${event?.abbr}/ui`} rel="noreferrer">
        <Button style={{ color: '#423A57' }}>Top</Button>
      </Link>
      <Link href={`/${event?.abbr}/ui/info`} rel="noreferrer">
        <Button style={{ color: '#423A57' }}>Info</Button>
      </Link>
      <TrailMapButton />
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
    </Styled.MobileMenu>
  )
}
