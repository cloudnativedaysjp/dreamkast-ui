import React from 'react'
import * as Styled from './styled'
import { ChatMessageMessageTypeEnum } from '../../../../client-axios'
import { ChatMessage } from './internal/ChatMessage'
import { ChatMessageClass, ChatMessageMap } from '../../../../util/chat'

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
      {Array.from(messages)
        .reverse()
        .map(([, chatMessage]) => {
          if (messageTypes.includes(chatMessage.messageType)) {
            return (
              <ChatMessage
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
