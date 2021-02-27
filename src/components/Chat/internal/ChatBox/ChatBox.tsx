import React from 'react'
import * as Styled from './styled'
import { ChatMessageMessageTypeEnum, Talk } from '../../../../client-axios'
import { ChatMessage } from './internal/ChatMessage'
import { ChatMessageClass, ChatMessageMap } from '../../../../util/chat'

type Props = {
  talk?: Talk
  messages: ChatMessageMap
  messageTypes: ChatMessageMessageTypeEnum[]
  selectedMessage: ChatMessageClass
  onClickMessage: (event: React.MouseEvent<HTMLInputElement>) => void
}

export const ChatBox: React.FC<Props> = ({
  talk,
  messages,
  messageTypes,
  selectedMessage,
  onClickMessage,
}) => {
  return (
    <Styled.Box overflow="scroll">
      {Array.from(messages)
        .reverse()
        .map(([, chatMessage]) => {
          if (messageTypes.includes(chatMessage.messageType)) {
            return (
              <ChatMessage
                talk={talk}
                key={chatMessage.id}
                chatMessage={chatMessage}
                selected={chatMessage.id == selectedMessage?.id}
                onClickMessage={onClickMessage}
              />
            )
          }
        })}
    </Styled.Box>
  )
}
