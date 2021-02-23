import React, { useEffect, useRef } from 'react'
import * as Styled from './styled'
import { ChatMessageMessageTypeEnum } from '../../client-axios/api'
import { ChatMessageClass } from './index'

type Props = {
  chatMessage: ChatMessageClass
  setRef: (
    chatMessage: ChatMessageClass,
    ref: React.RefObject<HTMLDivElement>,
  ) => void
  onClickMessage: (event: any) => void
}

const ChatMessage: React.FC<Props> = ({
  chatMessage,
  setRef,
  onClickMessage,
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const isSpeakerMessage = !!chatMessage.speakerId

  useEffect(() => {
    setRef(chatMessage, ref)
  }, [setRef, chatMessage, ref])

  return (
    <div ref={ref} onClick={onClickMessage} data-messageId={chatMessage.id}>
      <Styled.ChatMessage
        isChat={chatMessage.messageType == ChatMessageMessageTypeEnum.Chat}
      >
        {isSpeakerMessage ? '[S] ' : ''}
        {chatMessage.body}
      </Styled.ChatMessage>
      {chatMessage.children?.map((msg) => {
        return (
          <Styled.ChatReplyMessage
            isChat={msg.messageType == ChatMessageMessageTypeEnum.Chat}
          >
            {isSpeakerMessage ? '[S] ' : ''}
            {msg.body}
          </Styled.ChatReplyMessage>
        )
      })}
    </div>
  )
}

export default ChatMessage
