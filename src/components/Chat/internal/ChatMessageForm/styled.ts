import styled from 'styled-components'
import { Paper, Button } from '@material-ui/core'

export const Container = styled.div``

export const ChatMessage = styled(Paper)<{ isChat: boolean }>`
  padding: 10px;
  margin: 5px;
  background: ${({ isChat }) => (isChat ? '#ffffff' : '#f5f5f5')};
  white-space: pre-wrap;
`

export const ReplyMessageInfo = styled.div`
  background: rgba(255, 255, 255, 0.7);
  padding: 10px;
`

export const CloseReplyButton = styled(Button)`
  cursor: pointer;
  float: right;
  width: 20px;
`

export const ChatMessageForm = styled.form`
  background: rgba(255, 255, 255, 0.7);
  padding: 5px;
`
