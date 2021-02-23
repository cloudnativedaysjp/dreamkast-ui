import React from 'react'
import * as Styled from './styled'
import { ChatMessageMessageTypeEnum } from '../../client-axios'
import Grid from '@material-ui/core/Grid'
import ChatMessage from './ChatMessage'
import { ChatMessageClass, ChatMessageMap } from './index'

type Props = {
  messages: ChatMessageMap
  messageTypes: ChatMessageMessageTypeEnum[]
  selectedMessage: ChatMessageClass
  onClickMessage: (event: React.MouseEvent<HTMLInputElement>) => void
}

export const ChatBox: React.FC<Props> = ({
  messages,
  messageTypes,
  selectedMessage,
  onClickMessage,
}) => {
  return (
    <Styled.Box overflow="scroll">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          {Array.from(messages)
            .reverse()
            .map(([, chatMessage]) => {
              if (messageTypes.includes(chatMessage.messageType)) {
                return (
                  <ChatMessage
                    chatMessage={chatMessage}
                    selected={chatMessage.id == selectedMessage?.id}
                    onClickMessage={onClickMessage}
                  />
                )
              }
            })}
        </Grid>
      </Grid>
    </Styled.Box>
  )
}
