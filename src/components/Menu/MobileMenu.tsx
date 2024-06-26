import React from 'react'
import Button from '@material-ui/core/Button'
import * as Styled from './styled'
import * as CommonStyled from '../../styles/styled'
import { Event } from '../../generated/dreamkast-api.generated'
import InfoIcon from '@material-ui/icons/Info'
import MapIcon from '@material-ui/icons/Map'
import TableChartIcon from '@material-ui/icons/TableChart'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import InsertChartIcon from '@material-ui/icons/InsertChart'
import MenuIcon from '@material-ui/icons/Menu'
import ScheduleIcon from '@material-ui/icons/Schedule'
import ViewStreamIcon from '@material-ui/icons/ViewStream'
import SendIcon from '@material-ui/icons/Send'
import { Drawer, ListItem, ListItemIcon } from '@material-ui/core'
import Link from 'next/link'
import { useMenuContents } from './hooks'
import { useAuth0 } from '@auth0/auth0-react'
import { authSelector } from '../../store/auth'
import { useSelector } from 'react-redux'
import { AdminMobileMenu } from './internal/AdminMobileMenu/AdminMobileMenu'

type Props = {
  event?: Event
  isAdminRole?: boolean
}

export const MobileMenu: React.FC<Props> = ({ event, isAdminRole }) => {
  const { logout } = useAuth0()
  const { dkUrl } = useSelector(authSelector)
  const { guideUrl, isPreEvent } = useMenuContents()
  const [state, setState] = React.useState(false)
  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return
      }

      setState(open)
    }
  const list = () => (
    <div
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <Styled.RootList>
        <ListItem button key="info">
          <ListItemIcon>
            <ViewStreamIcon />
          </ListItemIcon>
          <Link href={`/${event?.abbr}/ui`} rel="noreferrer">
            <Button style={{ color: '#423A57' }}>Show Streaming</Button>
          </Link>
        </ListItem>

        <ListItem button key="info">
          <ListItemIcon>
            <InfoIcon />
          </ListItemIcon>
          <Link href={`/${event?.abbr}/profiles/view_qr`} rel="noreferrer">
            <Button style={{ color: '#423A57' }}>受付用二次元バーコード</Button>
          </Link>
        </ListItem>

        <ListItem button key="info">
          <ListItemIcon>
            <InfoIcon />
          </ListItemIcon>
          <Link href={`/${event?.abbr}/dashboard`} rel="noreferrer">
            <Button style={{ color: '#423A57' }}>Dashboard</Button>
          </Link>
        </ListItem>

        <ListItem button key="info">
          <ListItemIcon>
            <ScheduleIcon />
          </ListItemIcon>
          <Link href={`/${event?.abbr}/ui/info`} rel="noreferrer">
            <Button style={{ color: '#423A57' }}>Your Schedule</Button>
          </Link>
        </ListItem>

        {!isPreEvent && (
          <>
            <ListItem button key="guide">
              <ListItemIcon>
                <MapIcon />
              </ListItemIcon>
              <CommonStyled.MenuLink
                href={guideUrl()}
                rel="noreferrer"
                target="_blank"
              >
                <Button style={{ color: '#423A57' }}>Attendee Guide</Button>
              </CommonStyled.MenuLink>
            </ListItem>
          </>
        )}

        <ListItem button key="timetable">
          <ListItemIcon>
            <TableChartIcon />
          </ListItemIcon>
          <CommonStyled.MenuLink
            href={`/${event?.abbr}/timetables`}
            rel="noreferrer"
          >
            <Button style={{ color: '#423A57' }}>Timetable</Button>
          </CommonStyled.MenuLink>
        </ListItem>

        <ListItem>
          <ListItemIcon>
            <InsertChartIcon />
          </ListItemIcon>
          <CommonStyled.MenuLink href={`/${event?.abbr}/o11y`} rel="noreferrer">
            <Button style={{ color: '#423A57' }}>Grafana</Button>
          </CommonStyled.MenuLink>
        </ListItem>

        <ListItem button key="contact">
          <ListItemIcon>
            <SendIcon />
          </ListItemIcon>
          <CommonStyled.MenuLink
            href={'https://bit.ly/cnds2024-contactstaff'}
            target="_blank"
            rel="noreferrer noopener"
          >
            <Button style={{ color: '#423A57' }}>Contact</Button>
          </CommonStyled.MenuLink>
        </ListItem>

        {isAdminRole && <AdminMobileMenu event={event} />}

        <ListItem button key="logout">
          <ListItemIcon>
            <ExitToAppIcon />
          </ListItemIcon>
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
        </ListItem>
      </Styled.RootList>
    </div>
  )

  return (
    <Styled.MobileMenu>
      <Button onClick={toggleDrawer(true)}>
        <MenuIcon />
      </Button>
      <Drawer open={state} onClose={toggleDrawer(false)}>
        {list()}
      </Drawer>
      {/* TODO: TrailMapを使わない判断がされたら、TrailMap関連の処理を消す  */}
      {/* {isPreEvent ? '' : <TrailMapButton />} */}
    </Styled.MobileMenu>
  )
}
