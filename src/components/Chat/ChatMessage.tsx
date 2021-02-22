import React, { useEffect, useRef } from 'react'
import * as Styled from './styled'
import {
  ChatMessage as ChatMessageObject,
  ChatMessageMessageTypeEnum,
} from '../../client-axios/api'

type Props = {
  chatMessage: ChatMessageObject
  setRef: (
    chatMessage: ChatMessageObject,
    ref: React.RefObject<HTMLDivElement>,
  ) => void
}

const ChatMessage: React.FC<Props> = ({ chatMessage, setRef }) => {
  const ref = useRef<HTMLDivElement>(null)
  const isSpeakerMessage = !!chatMessage.speaker_id

  useEffect(() => {
    setRef(chatMessage, ref)
  }, [setRef, chatMessage, ref])

  return (
    <div ref={ref}>
      <Styled.ChatMessage
        isChat={chatMessage.messageType == ChatMessageMessageTypeEnum.Chat}
      >
        {isSpeakerMessage ? '[S] ' : ''}
        {chatMessage.body}
      </Styled.ChatMessage>
    </div>
  )
}

export default ChatMessage
