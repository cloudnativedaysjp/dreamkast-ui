import React from 'react'
import * as Styled from './styled'
import { ChatMessageMessageTypeEnum } from '../../client-axios/api'
import { ChatMessageClass } from './index'

type Props = {
  chatMessage?: ChatMessageClass
  selected: boolean
  onClickMessage: (event: any) => void
}

const ChatMessage: React.FC<Props> = ({
  chatMessage,
  selected,
  onClickMessage,
}) => {
  const isSpeakerMessage = !!chatMessage?.speakerId

  return (
    <div onClick={onClickMessage} data-messageId={chatMessage?.id}>
      {selected ? (
        <Styled.ChatSelectedMessage
          isChat={chatMessage?.messageType == ChatMessageMessageTypeEnum.Chat}
        >
          {isSpeakerMessage ? '[S] ' : ''}
          {chatMessage?.body}
        </Styled.ChatSelectedMessage>
      ) : (
        <Styled.ChatMessage
          isChat={chatMessage?.messageType == ChatMessageMessageTypeEnum.Chat}
        >
          {isSpeakerMessage ? '[S] ' : ''}
          {chatMessage?.body}
        </Styled.ChatMessage>
      )}
      {chatMessage?.children?.map((msg) => {
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
