import React, { useState } from 'react'
import * as Styled from './styled'
import {
  Event,
  ChatMessageApi,
  ChatMessageMessageTypeEnum,
  Profile,
  Talk,
} from '../../../../../../client-axios/api'
import { ChatMessageContainer } from '../../../../../../util/chat'
import MenuIcon from '@material-ui/icons/Menu'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import { ChatReplyForm } from '../../../ChatReplyForm'
import { MessageInputs } from '../../../ChatMessageRequest'
import Linkify from 'linkify-react'
import { ChatMessageMenu } from '../../ChatMessageMenu'
import { Configuration } from '../../../../../../client-axios'
import { Grid } from '@material-ui/core'
import { useSelector } from 'react-redux'
import { tokenSelector } from '../../../../../../store/authSelector'

dayjs.extend(timezone)
dayjs.extend(utc)

type Props = {
  event?: Event
  profile?: Profile
  talk?: Talk
  chatMessage?: ChatMessageContainer
  selected: boolean
  onClickReplyButton: (event: React.MouseEvent<HTMLInputElement>) => void
  onClickCloseButton: () => void
  onSendReply: (data: MessageInputs) => void
}

export const ChatMessage: React.FC<Props> = ({
  event,
  profile,
  talk,
  chatMessage,
  selected,
  onClickReplyButton,
  onClickCloseButton,
  onSendReply,
}) => {
  const isSpeakerMessage = (msg?: ChatMessageContainer) => {
    const speakerIds = talk?.speakers.map((speaker) => {
      return speaker.id
    })
    if (!speakerIds || !msg) return false
    return !!msg?.speakerId && speakerIds.includes(msg.speakerId)
  }
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [message, setMessage] = useState<ChatMessageContainer>()
  const accessToken = useSelector(tokenSelector)

  const isChat = chatMessage?.messageType === ChatMessageMessageTypeEnum.Chat

  const openChatMessageMenu = (e: React.MouseEvent<HTMLElement>) => {
    const selectedMessageId = e.currentTarget.getAttribute('data-messageId')
    const replyTo = e.currentTarget.getAttribute('data-replyto')
    if (!replyTo) {
      setMessage(chatMessage)
    } else {
      chatMessage?.children?.forEach((child) => {
        if (child?.id == Number(selectedMessageId)) {
          setMessage(child)
        }
      })
    }
    setAnchorEl(e.currentTarget)
  }

  const closeChatMessageMenu = () => {
    setAnchorEl(null)
  }
  const onMenuClick = (e: React.MouseEvent<HTMLElement>) => {
    const selectedMessageId = e.currentTarget.getAttribute('data-messageId')
    if (!selectedMessageId || !event) return
    const api = new ChatMessageApi(
      new Configuration({ basePath: window.location.origin }),
    )
    const newChatMessage = {
      eventAbbr: event.abbr,
      body: 'このメッセージは削除されました',
    }
    api.apiV1ChatMessagesMessageIdPut(selectedMessageId, newChatMessage, {
      headers: {
        authorization: `Bearer: ${accessToken}`,
      },
    })
    setAnchorEl(null)
  }

  return (
    <div>
      <Styled.ChatMessage isChat={isChat} isSelected={selected}>
        <Grid container>
          <Grid item xs={11}>
            {dayjs(chatMessage?.createdAt).tz('Asia/Tokyo').format('HH:mm')}
          </Grid>

          <Grid item xs={1}>
            <Styled.MenuButton
              onClick={openChatMessageMenu}
              data-messageid={chatMessage?.id}
              data-replyto={chatMessage?.replyTo}
            >
              <Styled.MenuIcon fontSize="small" />
            </Styled.MenuButton>
          </Grid>

          <Grid item xs={11}>
            <Styled.MessageBody>
              {isSpeakerMessage(chatMessage) ? '[スピーカー] ' : ''}
              <Linkify>{chatMessage?.body}</Linkify>
            </Styled.MessageBody>
          </Grid>

          <Grid item xs={1}>
            {!selected &&
              chatMessage?.body != 'このメッセージは削除されました' && (
                <Styled.ReplyButton
                  data-messageId={chatMessage?.id}
                  onClick={onClickReplyButton}
                >
                  <Styled.ReplyIcon fontSize="small" />
                </Styled.ReplyButton>
              )}
          </Grid>
        </Grid>
      </Styled.ChatMessage>
      {chatMessage?.children &&
        Array.from(chatMessage.children).map(([, msg]) => {
          return (
            <Styled.ChatReplyMessage key={msg.id} isChat={isChat}>
              <Styled.MessageBody>
                {isSpeakerMessage(msg) ? '[スピーカー] ' : ''}
                {msg.body}
              </Styled.MessageBody>

              <Styled.MenuButton
                onClick={openChatMessageMenu}
                data-messageid={msg.id}
                data-replyto={msg.replyTo}
              >
                <MenuIcon fontSize="small" />
              </Styled.MenuButton>
            </Styled.ChatReplyMessage>
          )
        })}

      <ChatMessageMenu
        profile={profile}
        chatMessage={message}
        anchorEl={anchorEl}
        onClose={closeChatMessageMenu}
        onMenuClick={onMenuClick}
      />

      {selected && (
        <ChatReplyForm
          onClickCloseButton={onClickCloseButton}
          onSendReply={onSendReply}
        />
      )}
    </div>
  )
}
