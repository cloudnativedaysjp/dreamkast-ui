import React from 'react'
import Button from '@material-ui/core/Button'
import * as Styled from './styled'
import * as CommonStyled from '../../styles/styled'
import { Event } from '../../generated/dreamkast-api.generated'
import Link from 'next/link'
import { TrailMapButton } from '../TrailMap/TrailMapButton'
import { useMenuContents } from './hooks'
import { useAuth0 } from '@auth0/auth0-react'
import { useSelector } from 'react-redux'
import { authSelector } from '../../store/authSelector'

type Props = {
  event?: Event
}

export const DesktopMenu: React.FC<Props> = ({ event }) => {
  const { logout } = useAuth0()
  const { dkUrl } = useSelector(authSelector)
  const { guideUrl, isPreEvent } = useMenuContents()

  return (
    <Styled.DesktopMenu>
      {isPreEvent ? (
        ''
      ) : (
        <>
          <CommonStyled.MenuLink
            href={guideUrl()}
            rel="noreferrer"
            target="_blank"
          >
            <Button style={{ color: '#423A57' }}>Attendee Guide</Button>
          </CommonStyled.MenuLink>
        </>
      )}

      <Link href={`/${event?.abbr}/ui/info`} rel="noreferrer">
        <Button style={{ color: '#423A57' }}>Your Plan</Button>
      </Link>

      {isPreEvent ? (
        ''
      ) : (
        <>
          <TrailMapButton />
          <CommonStyled.MenuLink
            href="https://miro.com/app/board/uXjVPWsauOI=/"
            rel="noreferrer"
            target="_blank"
          >
            <Button style={{ color: '#423A57' }}>Whiteboard</Button>
          </CommonStyled.MenuLink>
        </>
      )}

      <CommonStyled.MenuLink
        href={`/${event?.abbr}/o11y`}
        rel="noreferrer"
        target="_blank"
      >
        <Button style={{ color: '#423A57' }}>Grafana</Button>
      </CommonStyled.MenuLink>
      <CommonStyled.MenuLink
        href={`/${event?.abbr}/timetables`}
        rel="noreferrer"
      >
        <Button style={{ color: '#423A57' }}>Timetable</Button>
      </CommonStyled.MenuLink>
      <Button
        style={{ color: '#423A57' }}
        onClick={() => logout({ returnTo: dkUrl })}
      >
        Logout
      </Button>
    </Styled.DesktopMenu>
  )
}
