import React from 'react'
import * as Styled from './styled'
import {
  ChatMessageMessageTypeEnum,
  Talk,
} from '../../../../../../client-axios/api'
import { ChatMessageClass } from '../../../../../../util/chat'
import ReplyIcon from '@material-ui/icons/Reply'
import moment from 'moment/moment'
import { ChatReplyForm } from '../../../ChatReplyForm'
import { MessageInputs } from '../../../ChatMessageRequest'

type Props = {
  talk?: Talk
  chatMessage?: ChatMessageClass
  selected: boolean
  onClickReplyButton: (event: React.MouseEvent<HTMLInputElement>) => void
  onClickCloseButton: () => void
  onSendReply: (data: MessageInputs) => void
}

export const ChatMessage: React.FC<Props> = ({
  talk,
  chatMessage,
  selected,
  onClickReplyButton,
  onClickCloseButton,
  onSendReply,
}) => {
  const isSpeakerMessage = () => {
    const speakerIds = talk?.speakers.map((speaker) => {
      return speaker.id
    })
    if (!speakerIds) return false
    return (
      !!chatMessage?.speakerId && speakerIds.includes(chatMessage.speakerId)
    )
  }
  const isChat = chatMessage?.messageType === ChatMessageMessageTypeEnum.Chat

  return (
    <div>
      <Styled.ChatMessage isChat={isChat} isSelected={selected}>
        {moment(chatMessage?.createdAt).format('HH:MM')}
        {!selected && (
          <Styled.ReplyButton
            data-messageId={chatMessage?.id}
            onClick={onClickReplyButton}
          >
            <ReplyIcon fontSize="small" />
          </Styled.ReplyButton>
        )}
        <Styled.MessageBody>
          {isSpeakerMessage() ? '[スピーカー] ' : ''}
          {chatMessage?.body}
        </Styled.MessageBody>
      </Styled.ChatMessage>
      {chatMessage?.children?.map((msg) => {
        return (
          <Styled.ChatReplyMessage key={msg.id} isChat={isChat}>
            <Styled.MessageBody>
              {isSpeakerMessage() ? '[スピーカー] ' : ''}
              {msg.body}
            </Styled.MessageBody>
          </Styled.ChatReplyMessage>
        )
      })}
      {selected && (
        <ChatReplyForm
          onClickCloseButton={onClickCloseButton}
          onSendReply={onSendReply}
        />
      )}
    </div>
  )
}
