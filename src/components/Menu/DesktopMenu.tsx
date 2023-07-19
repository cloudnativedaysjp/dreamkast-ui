import React from 'react'
import Button from '@material-ui/core/Button'
import * as Styled from './styled'
import * as CommonStyled from '../../styles/styled'
import { Event } from '../../generated/dreamkast-api.generated'
import Link from 'next/link'
import { useMenuContents } from './hooks'
import { useAuth0 } from '@auth0/auth0-react'
import { useSelector } from 'react-redux'
import { authSelector } from '../../store/auth'

type Props = {
  event?: Event
}

export const DesktopMenu: React.FC<Props> = ({ event }) => {
  const { logout } = useAuth0()
  const { dkUrl } = useSelector(authSelector)
  const { guideUrl, isPreEvent } = useMenuContents()

  return (
    <Styled.DesktopMenu>
      {!isPreEvent && (
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

      {/* TODO: TrailMapを使わない判断がされたら、TrailMap関連の処理を消す  */}
      {/* {!isPreEvent && <TrailMapButton />} */}

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
        onClick={() =>
          logout({
            logoutParams: {
              returnTo: dkUrl,
            },
          })
        }
      >
        Logout
      </Button>
    </Styled.DesktopMenu>
  )
}
