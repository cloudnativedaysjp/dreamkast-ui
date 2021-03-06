import styled from 'styled-components'
import { Paper } from '@material-ui/core'
import { Menu as MuiMenuIcon } from '@material-ui/icons'
import { Reply as MuiReplyIcon } from '@material-ui/icons'

export const ChatMessage = styled(Paper)<{
  isChat: boolean
  isSelected?: boolean
}>`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 10px;
  margin: 8px;
  background: ${({ isChat, isSelected }) =>
    isSelected ? 'cornsilk' : isChat ? '#ffffff' : '#c8f2f7'};
  white-space: space-wrap;
`

export const MessageBody = styled.div`
  display: flex;
  word-break: break-word;
  align-items: center;
  width: 90%;
`

export const ChatReplyMessage = styled(ChatMessage)`
  margin-left: 30px;
`
export const MenuButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: dimgray;
`
export const MenuIcon = styled(MuiMenuIcon)`
  margin: 0 0 0 auto;
`

export const ReplyButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: dimgray;
`

export const ReplyIcon = styled(MuiReplyIcon)`
  margin: 0 0 0 auto;
`
export const DeleteButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: dimgray;
`
