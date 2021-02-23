import React from 'react'
import * as Styled from './styled'
import { ChatMessageMessageTypeEnum } from '../../client-axios'
import Grid from '@material-ui/core/Grid'
import ChatMessage from './ChatMessage'
import { ChatMessageMap } from './Chat'
import { ChatMessageClass } from './index'

type Props = {
  messages: ChatMessageMap
  messageTypes: ChatMessageMessageTypeEnum[]
  onClickMessage: (e: any) => void
}

export const ChatBox: React.FC<Props> = ({
  messages,
  messageTypes,
  onClickMessage,
}) => {
  const setLastMessageElement = (
    chatMessage: ChatMessageClass,
    ref: React.RefObject<HTMLDivElement>,
  ) => {
    if (!messages) return
    const lastChat = Array.from(messages)[messages.size - 1][1]
    if (chatMessage.id === lastChat.id) {
      ref && ref.current && ref.current.scrollIntoView()
    }
  }

  return (
    <Styled.Box overflow="scroll">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          {Array.from(messages).map(([_id, chatMessage]) => {
            if (messageTypes.includes(chatMessage.messageType)) {
              return (
                <ChatMessage
                  chatMessage={chatMessage}
                  setRef={setLastMessageElement}
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
