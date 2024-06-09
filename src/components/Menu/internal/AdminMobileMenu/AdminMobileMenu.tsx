import React from 'react'
import { Button, ListItem, ListItemIcon, ListItemText } from '@material-ui/core'
import CheckIcon from '@material-ui/icons/Check'
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight'
import * as Styled from './styled'
import * as CommonStyled from '../../../../styles/styled'
import Link from 'next/link'
import { Event } from '../../../../generated/dreamkast-api.generated'

type Props = {
  event?: Event
}

export const AdminMobileMenu: React.FC<Props> = ({ event }) => {
  return (
    <div>
      <ListItem button>
        <ListItemIcon>
          <KeyboardArrowRightIcon />
        </ListItemIcon>
        <ListItemText primary="Admin" />
      </ListItem>

      <Styled.NestedListItem button key="check_in_event">
        <ListItemIcon>
          <CheckIcon />
        </ListItemIcon>
        <Link href={`/${event?.abbr}/ui/admin/check_in_event`} rel="noreferrer">
          <Button style={{ color: '#423A57' }}>Check-In (Event)</Button>
        </Link>
      </Styled.NestedListItem>

      <Styled.NestedListItem button key="check_in_session">
        <ListItemIcon>
          <CheckIcon />
        </ListItemIcon>
        <Link
          href={`/${event?.abbr}/ui/admin/check_in_session`}
          rel="noreferrer"
        >
          <Button style={{ color: '#423A57' }}>Check-In (Session)</Button>
        </Link>
      </Styled.NestedListItem>
    </div>
  )
}
