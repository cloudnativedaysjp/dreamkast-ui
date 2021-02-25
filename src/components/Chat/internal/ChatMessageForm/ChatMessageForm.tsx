import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import * as Styled from './styled'
import {
  ChatMessageApi,
  ChatMessageMessageTypeEnum,
  Configuration,
} from '../../../../client-axios'
import { ChatMessageClass } from '../../../../util/chat'
import { ReactButton } from './internal/ReactButton'
import { Button, Checkbox, IconButton } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'

type Props = {
  roomId?: number
  selectedMessage: ChatMessageClass
  onClickCloseButton: () => void
}

type Inputs = {
  chatMessage: string
  isQuestion: boolean
}

export const ChatMessageRequest = (
  eventAbbr: string,
  roomId: number,
  roomType: string,
  body: string,
  replyTo: number | null,
): {
  eventAbbr: string
  roomId: number
  roomType: string
  body: string
  messageType: ChatMessageMessageTypeEnum
  replyTo: number | null
} => {
  return {
    eventAbbr: eventAbbr,
    roomId: roomId,
    roomType: roomType,
    body: body,
    messageType: ChatMessageMessageTypeEnum.Chat,
    replyTo: replyTo,
  }
}

export const ChatMessageForm: React.FC<Props> = ({
  roomId,
  selectedMessage,
  onClickCloseButton,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { isSubmitSuccessful },
  } = useForm<Inputs>()

  const [submittedData, setSubmittedData] = useState({})
  const messageSelected = !!selectedMessage.id
  const isChat = selectedMessage?.messageType == ChatMessageMessageTypeEnum.Chat
  const watchChatMessage = watch('chatMessage')

  const createChatMessageRequest = (data: Inputs, roomId: number) => {
    const req = ChatMessageRequest(
      'cndo2021',
      roomId,
      'talk',
      data.chatMessage,
      null,
    )
    if (selectedMessage && selectedMessage.id) {
      req.replyTo = selectedMessage.id
    }
    if (data.isQuestion) {
      req.messageType = ChatMessageMessageTypeEnum.Qa
    }
    return req
  }

  const onSubmit = (data: Inputs) => {
    if (!roomId) return
    const api = new ChatMessageApi(
      new Configuration({ basePath: window.location.origin }),
    )
    setSubmittedData(data)
    api.apiV1ChatMessagesPost(createChatMessageRequest(data, roomId))
  }
  useEffect(() => {
    if (isSubmitSuccessful) {
      reset({ chatMessage: '' })
    }
  }, [isSubmitSuccessful, submittedData, reset])

  return (
    <Styled.Container>
      {messageSelected && (
        <Styled.ReplyMessageInfo>
          <Styled.ReplyTitleContainer>
            Reply To:
            <IconButton
              aria-label="close"
              size="small"
              onClick={onClickCloseButton}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Styled.ReplyTitleContainer>
          <Styled.ChatMessage isChat={isChat}>
            {selectedMessage?.body}
          </Styled.ChatMessage>
        </Styled.ReplyMessageInfo>
      )}
      <Styled.ChatMessageForm onSubmit={handleSubmit(onSubmit)}>
        <Styled.TextField
          name="chatMessage"
          color="secondary"
          size="small"
          inputRef={register}
          multiline
        />
        {!messageSelected && (
          <Styled.QuestionChecker>
            <Checkbox
              color="secondary"
              size="small"
              name="isQuestion"
              inputRef={register}
            />
            質問を送る
          </Styled.QuestionChecker>
        )}
        <Styled.ButtonContainer>
          <ReactButton reactEmoji="👍" roomId={roomId} />
          <ReactButton reactEmoji="👏" roomId={roomId} />
          <ReactButton reactEmoji="🎉" roomId={roomId} />
          <Button
            type="submit"
            disabled={!watchChatMessage}
            variant="contained"
          >
            送信
          </Button>
        </Styled.ButtonContainer>
      </Styled.ChatMessageForm>
    </Styled.Container>
  )
}
