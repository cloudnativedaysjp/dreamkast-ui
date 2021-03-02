import React from 'react'
import * as Styled from './styled'
import {
  ChatMessageMessageTypeEnum,
  Talk,
} from '../../../../../../client-axios/api'
import { ChatMessageClass } from '../../../../../../util/chat'
import ReplyIcon from '@material-ui/icons/Reply'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import { ChatReplyForm } from '../../../ChatReplyForm'
import { MessageInputs } from '../../../ChatMessageRequest'
import Linkify from 'linkifyjs/react'

dayjs.extend(timezone)
dayjs.extend(utc)

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
  const isSpeakerMessage = (msg?: ChatMessageClass) => {
    const speakerIds = talk?.speakers.map((speaker) => {
      return speaker.id
    })
    if (!speakerIds || !msg) return false
    return !!msg?.speakerId && speakerIds.includes(msg.speakerId)
  }
  const isChat = chatMessage?.messageType === ChatMessageMessageTypeEnum.Chat

  return (
    <div>
      <Styled.ChatMessage isChat={isChat} isSelected={selected}>
        {dayjs(chatMessage?.createdAt).tz('Asia/Tokyo').format('HH:MM')}
        {!selected && (
          <Styled.ReplyButton
            data-messageId={chatMessage?.id}
            onClick={onClickReplyButton}
          >
            <ReplyIcon fontSize="small" />
          </Styled.ReplyButton>
        )}
        <Styled.MessageBody>
          {isSpeakerMessage(chatMessage) ? '[スピーカー] ' : ''}
          <Linkify>{chatMessage?.body}</Linkify>
        </Styled.MessageBody>
      </Styled.ChatMessage>
      {chatMessage?.children?.map((msg) => {
        return (
          <Styled.ChatReplyMessage key={msg.id} isChat={isChat}>
            <Styled.MessageBody>
              {isSpeakerMessage(msg) ? '[スピーカー] ' : ''}
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
