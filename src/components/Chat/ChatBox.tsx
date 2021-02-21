import React from 'react'
import * as Styled from './styled'
import {
  ChatMessage as ChatMessageInterface,
  ChatMessageMessageTypeEnum,
} from '../../client-axios'
import Grid from '@material-ui/core/Grid'
import ChatMessage from './ChatMessage'

type Props = {
  messages: ChatMessageInterface[]
  messageTypes: ChatMessageMessageTypeEnum[]
}

export const ChatBox: React.FC<Props> = ({ messages, messageTypes }) => {
  const setLastMessageElement = (
    chatMessage: ChatMessageInterface,
    ref: React.RefObject<HTMLDivElement>,
  ) => {
    const lastChat = messages[messages.length - 1]
    if (chatMessage.id === lastChat.id) {
      ref && ref.current && ref.current.scrollIntoView()
    }
  }

  return (
    <Styled.Box overflow="scroll">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          {messages.map((chatMessage) => {
            if (messageTypes.includes(chatMessage.messageType)) {
              return (
                <ChatMessage
                  chatMessage={chatMessage}
                  setRef={setLastMessageElement}
                />
              )
            }
          })}
        </Grid>
      </Grid>
    </Styled.Box>
  )
}
