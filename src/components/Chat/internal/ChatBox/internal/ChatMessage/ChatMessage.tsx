import React, { useState } from 'react'
import * as Styled from './styled'
import {
  ChatMessageApi,
  ChatMessageMessageTypeEnum,
  Talk,
} from '../../../../../../client-axios/api'
import { ChatMessageClass } from '../../../../../../util/chat'
import ReplyIcon from '@material-ui/icons/Reply'
import MenuIcon from '@material-ui/icons/Menu'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import { ChatReplyForm } from '../../../ChatReplyForm'
import { MessageInputs } from '../../../ChatMessageRequest'
import Linkify from 'linkifyjs/react'
import { ChatMessageMenu } from '../../ChatMessageMenu'
import { Configuration } from '../../../../../../client-axios'

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
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const isChat = chatMessage?.messageType === ChatMessageMessageTypeEnum.Chat
  const openChatMessageMenu = (e: React.MouseEvent<HTMLElement>) => {
    console.log('openChatMessageMenu')
    setAnchorEl(e.currentTarget)
  }
  const closeChatMessageMenu = () => {
    setAnchorEl(null)
  }
  const onMenuClick = (e: React.MouseEvent<HTMLElement>) => {
    console.log('clicccccccccccc')
    const selectedMessageId = e.currentTarget.getAttribute('data-messageId')
    if (!selectedMessageId) return
    const api = new ChatMessageApi(
      new Configuration({ basePath: window.location.origin }),
    )
    const newChatMessage = {
      eventAbbr: 'cndo2021',
      body: 'このメッセージは削除されました',
    }
    api.apiV1ChatMessagesMessageIdPut(selectedMessageId, newChatMessage)
    setAnchorEl(null)
  }

  return (
    <div>
      <Styled.ChatMessage isChat={isChat} isSelected={selected}>
        {dayjs(chatMessage?.createdAt).tz('Asia/Tokyo').format('HH:MM')}
        <Styled.MenuButton onClick={openChatMessageMenu}>
          <MenuIcon fontSize="small" />
        </Styled.MenuButton>

        <ChatMessageMenu
          chatMessage={chatMessage}
          anchorEl={anchorEl}
          onClose={closeChatMessageMenu}
          onMenuClick={onMenuClick}
        />

        <Styled.MessageBody>
          {isSpeakerMessage(chatMessage) ? '[スピーカー] ' : ''}
          <Linkify>{chatMessage?.body}</Linkify>
        </Styled.MessageBody>
        {!selected && (
          <Styled.ReplyButton
            data-messageId={chatMessage?.id}
            onClick={onClickReplyButton}
          >
            <ReplyIcon fontSize="small" />
          </Styled.ReplyButton>
        )}
      </Styled.ChatMessage>
      {chatMessage?.children?.map((msg) => {
        return (
          <Styled.ChatReplyMessage key={msg.id} isChat={isChat}>
            <Styled.MessageBody>
              {isSpeakerMessage(msg) ? '[スピーカー] ' : ''}
              {msg.body}
            </Styled.MessageBody>

            <Styled.MenuButton>
              <MenuIcon fontSize="small" />
            </Styled.MenuButton>
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
