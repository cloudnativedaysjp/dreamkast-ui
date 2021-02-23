import styled from 'styled-components'
import { Paper, Box as MaterialUIBox, Button } from '@material-ui/core'

export const Box = styled(MaterialUIBox)`
  height: 400px;
  background: rgba(255, 255, 255, 0.7);
`

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

export const CloseReplyButton = styled(Button)`
  cursor: pointer;
  float: right;
  margintop: 5px;
  width: 20px;
`

export const ChatMessageForm = styled.form`
  background: rgba(255, 255, 255, 0.7);
  margin-top: 30px;
  padding: 5px;
`

export const ReactButton = styled(Button)`
  margin-right: 5px;
`
