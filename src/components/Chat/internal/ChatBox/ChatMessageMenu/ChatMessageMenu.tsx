import React from 'react'
import * as Styled from './styled'
import { Menu, MenuItem } from '@material-ui/core'
import { ChatMessageContainer } from '../../../../../util/chat'
import { Profile } from '../../../../../generated/dreamkast-api.generated'

type Props = {
  profile?: Profile
  chatMessage?: ChatMessageContainer
  anchorEl?: null | HTMLElement
  onClose: () => void
  onMenuClick: (e: React.MouseEvent<HTMLElement>) => void
}

export const ChatMessageMenu: React.FC<Props> = ({
  profile,
  chatMessage,
  anchorEl,
  onClose,
  onMenuClick,
}) => {
  const menuItemDisabled = () => {
    return !(
      chatMessage?.profileId == profile?.id &&
      chatMessage?.body != 'このメッセージは削除されました'
    )
  }
  return (
    <Menu
      id="user-menu"
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={onClose}
    >
      <MenuItem
        onClick={onMenuClick}
        data-messageId={chatMessage?.id}
        disabled={menuItemDisabled()}
      >
        <Styled.DeleteIcon />
        Delete
      </MenuItem>
    </Menu>
  )
}
