import React from 'react'
import * as Styled from './styled'
import { ChatMessageMessageTypeEnum } from '../../../../../../client-axios/api'
import { ChatMessageClass } from '../../../../../../util/chat'
import ReplyIcon from '@material-ui/icons/Reply'

type Props = {
  chatMessage?: ChatMessageClass
  selected: boolean
  onClickMessage: (event: React.MouseEvent<HTMLInputElement>) => void
}

export const ChatMessage: React.FC<Props> = ({
  chatMessage,
  selected,
  onClickMessage,
}) => {
  const isSpeakerMessage = !!chatMessage?.speakerId
  const isChat = chatMessage?.messageType === ChatMessageMessageTypeEnum.Chat

  return (
    <div>
      <Styled.ChatMessage isChat={isChat} isSelected={selected}>
        <Styled.MessageBody>
          {isSpeakerMessage ? '[S] ' : ''}
          {chatMessage?.body}
        </Styled.MessageBody>
        {!selected && (
          <Styled.ReplyButton
            data-messageId={chatMessage?.id}
            onClick={onClickMessage}
          >
            <ReplyIcon fontSize="small" />
          </Styled.ReplyButton>
        )}
      </Styled.ChatMessage>
      {chatMessage?.children?.map((msg) => {
        return (
          <Styled.ChatReplyMessage key={msg.id} isChat={isChat}>
            <Styled.MessageBody>
              {isSpeakerMessage ? '[S] ' : ''}
              {msg.body}
            </Styled.MessageBody>
          </Styled.ChatReplyMessage>
        )
      })}
    </div>
  )
}
