import styled from 'styled-components'
import { Paper } from '@material-ui/core'

export const ChatMessage = styled(Paper)<{
  isChat: boolean
  isSelected?: boolean
}>`
  display: flex;
  justify-content: space-between;
  padding: 10px;
  margin: 8px;
  background: ${({ isChat, isSelected }) =>
    isSelected ? 'cornsilk' : isChat ? '#ffffff' : '#c8f2f7'};
  white-space: space-wrap;
`

export const MessageBody = styled.div`
  display: flex;
  align-items: center;
  overflow-y: hidden;
  height: 24px;
  width: 90%;
  &::-webkit-scrollbar {
    height: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: lightgrey;
  }
`

export const ChatReplyMessage = styled(ChatMessage)`
  margin-left: 30px;
`

export const ReplyButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: dimgray;
`
