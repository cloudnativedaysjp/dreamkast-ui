import React from 'react'
import * as Styled from './styled'
import { Menu, MenuItem } from '@material-ui/core'
import { ChatMessageClass } from '../../../../../util/chat'

type Props = {
  chatMessage?: ChatMessageClass
  anchorEl?: null | HTMLElement
  onClose: () => void
  onMenuClick: (e: React.MouseEvent<HTMLElement>) => void
}

export const ChatMessageMenu: React.FC<Props> = ({
  chatMessage,
  anchorEl,
  onClose,
  onMenuClick,
}) => {
  return (
    <Menu
      id="user-menu"
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={onClose}
    >
      <MenuItem onClick={onMenuClick} data-messageId={chatMessage?.id}>
        <Styled.DeleteIcon />
        Delete
      </MenuItem>
    </Menu>
  )
}
