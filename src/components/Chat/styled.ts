import styled from 'styled-components'
import { Paper, Box as MaterialUIBox } from '@material-ui/core'

export const Box = styled(MaterialUIBox)`
  height: 400px;
`

export const ChatMessage = styled(Paper)<{ isChat: boolean }>`
  padding: 10px;
  background: ${({ isChat }) => (isChat ? '#ffffff' : '#f5f5f5')};
  white-sace: pre-wrap;
`
