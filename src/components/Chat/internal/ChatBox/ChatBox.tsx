import React, { useEffect } from 'react'
import * as Styled from './styled'
import {
  ChatMessageMessageTypeEnum,
  Profile,
  Talk,
} from '../../../../client-axios'
import { ChatMessage } from './internal/ChatMessage'
import { ChatMessageClass, ChatMessageMap } from '../../../../util/chat'
import { MessageInputs } from '../ChatMessageRequest'

type Props = {
  profile?: Profile
  talk?: Talk
  messages: ChatMessageMap
  messageTypes: ChatMessageMessageTypeEnum[]
  selectedMessage: ChatMessageClass
  checked: boolean
  onClickReplyButton: (event: React.MouseEvent<HTMLInputElement>) => void
  onClickCloseButton: () => void
  onSendReply: (data: MessageInputs) => void
}

export const ChatBox: React.FC<Props> = ({
  profile,
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
    if (checked) box?.scrollBy(0, Array.from(messages).length * 100)
  }, [messages])
  return (
    <Styled.Box overflow="scroll" id="message-box">
      {Array.from(messages).map(([, chatMessage]) => {
        if (messageTypes.includes(chatMessage.messageType)) {
          return (
            <ChatMessage
              profile={profile}
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
