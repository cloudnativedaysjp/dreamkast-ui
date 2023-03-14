import React, { useEffect } from 'react'
import * as Styled from './styled'
import { ChatMessage } from './internal/ChatMessage'
import { ChatMessageContainer, ChatMessageMap } from '../../../../util/chat'
import { MessageInputs } from '../ChatMessageRequest'
import {
  Event,
  ChatMessageProperties,
  Talk,
} from '../../../../generated/dreamkast-api.generated'

type Props = {
  event?: Event
  talk?: Talk
  messages: ChatMessageMap
  messageTypes: ChatMessageProperties['messageType'][]
  selectedMessage: ChatMessageContainer
  checked: boolean
  onClickReplyButton: (event: React.MouseEvent<HTMLInputElement>) => void
  onClickCloseButton: () => void
  onSendReply: (data: MessageInputs) => void
}

export const ChatBox: React.FC<Props> = ({
  event,
  talk,
  messages,
  messageTypes,
  selectedMessage,
  checked,
  onClickCloseButton,
  onClickReplyButton,
  onSendReply,
}) => {
  useEffect(() => {
    const box = document.getElementById('message-box')
    if (checked && box?.scrollBy) {
      box?.scrollBy(0, Array.from(messages).length * 100)
    }
  }, [messages])
  return (
    <Styled.Box overflow="scroll" id="message-box">
      {Array.from(messages).map(([, chatMessage]) => {
        if (messageTypes.includes(chatMessage.messageType)) {
          return (
            <ChatMessage
              event={event}
              talk={talk}
              key={chatMessage.id}
              chatMessage={chatMessage}
              selected={chatMessage.id == selectedMessage?.id}
              onClickReplyButton={onClickReplyButton}
              onClickCloseButton={onClickCloseButton}
              onSendReply={onSendReply}
            />
          )
        }
      })}
    </Styled.Box>
  )
}
