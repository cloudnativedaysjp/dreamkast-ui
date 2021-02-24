import styled from 'styled-components'
import { Paper } from '@material-ui/core'

export const ChatMessage = styled(Paper)<{ isChat: boolean }>`
  padding: 10px;
  margin: 5px;
  background: ${({ isChat }) => (isChat ? '#ffffff' : '#f5f5f5')};
  white-space: pre-wrap;
`
export const ChatReplyMessage = styled(ChatMessage)`
  margin-left: 20px;
`

export const ChatSelectedMessage = styled(ChatMessage)`
  background-color: cornsilk;
`

export const ReplyButton = styled.div`
  float: right;
  color: dimgray;
  width: 30px;
  height: 30px;
`
