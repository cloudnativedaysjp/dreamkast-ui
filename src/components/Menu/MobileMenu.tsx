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
import ChatIcon from '@material-ui/icons/Chat'
import { Drawer, List, ListItem, ListItemIcon } from '@material-ui/core'
import Link from 'next/link'
import { useMenuContents } from './hooks'
import { useAuth0 } from '@auth0/auth0-react'
import { authSelector } from '../../store/auth'
import { useSelector } from 'react-redux'

type Props = {
  event?: Event
}

export const MobileMenu: React.FC<Props> = ({ event }) => {
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
      <List>
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

        <ListItem button key="qa">
          <ListItemIcon>
            <ChatIcon />
          </ListItemIcon>
          <Link href={`/${event?.abbr}/ui/qa`} rel="noreferrer">
            <Button style={{ color: '#423A57' }}>Your QA</Button>
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
            href={
              'https://docs.google.com/forms/d/e/1FAIpQLSebjgStNdgMe8XJHnyn_gF4xv8t4jGB8hw8Jrcr04DYLZis0Q/viewform?usp=sf_link'
            }
            target="_blank"
            rel="noreferrer noopener"
          >
            <Button style={{ color: '#423A57' }}>Contact</Button>
          </CommonStyled.MenuLink>
        </ListItem>

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
      </List>
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
