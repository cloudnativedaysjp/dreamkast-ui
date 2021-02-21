import styled, { css } from 'styled-components'
import { Paper, Box as MaterialUIBox } from '@material-ui/core'

export const Box = styled(MaterialUIBox)`
  height: 400px;
`

export const ChatMessage = styled(Paper)<{ isChat: boolean }>`
  padding: 10px;
  background: #ffffff;
  white-sace: pre-wrap;

  ${(props) =>
    props.isChat
      ? css`
          background: #f5f5f5;
        `
      : ''}
`
