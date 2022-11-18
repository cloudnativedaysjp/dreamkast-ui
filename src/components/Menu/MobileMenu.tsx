import React from 'react'
import Button from '@material-ui/core/Button'
import * as Styled from './styled'
import * as CommonStyled from '../../styles/styled'
import { Event } from '../../generated/dreamkast-api.generated'
import InfoIcon from '@material-ui/icons/Info'
import MapIcon from '@material-ui/icons/Map'
import TableChartIcon from '@material-ui/icons/TableChart'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import { TrailMapButton } from '../TrailMap/TrailMapButton'
import MenuIcon from '@material-ui/icons/Menu'
import { Drawer, List, ListItem, ListItemIcon } from '@material-ui/core'
import Link from 'next/link'

type Props = {
  event?: Event
  url: string
}

export const MobileMenu: React.FC<Props> = ({ event, url }) => {
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
            <InfoIcon />
          </ListItemIcon>
          <Link href={`/${event?.abbr}/ui/info`} rel="noreferrer">
            <Button style={{ color: '#423A57' }}>Info</Button>
          </Link>
        </ListItem>
        <ListItem button key="guide">
          <ListItemIcon>
            <MapIcon />
          </ListItemIcon>
          <CommonStyled.MenuLink
            href="https://sites.google.com/view/cndt2022-guide"
            rel="noreferrer"
            target="_blank"
          >
            <Button style={{ color: '#423A57' }}>Guide</Button>
          </CommonStyled.MenuLink>
        </ListItem>
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
        <ListItem button key="logout">
          <ListItemIcon>
            <ExitToAppIcon />
          </ListItemIcon>
          <Button href={url} style={{ color: '#423A57' }}>
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
      <TrailMapButton />
      <CommonStyled.MenuLink href={`/${event?.abbr}/o11y`} rel="noreferrer">
        <Button style={{ color: '#423A57' }}>Grafana</Button>
      </CommonStyled.MenuLink>
    </Styled.MobileMenu>
  )
}
