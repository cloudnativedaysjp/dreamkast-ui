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
    formState: { isSubmitSuccessful },
  } = useForm<Inputs>()
  const [submittedData, setSubmittedData] = useState({})
  const messageSelected = !!selectedMessage.id
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
      <Styled.ReplyMessageInfo>
        {messageSelected && (
          <div>
            Reply To:
            <Styled.CloseReplyButton onClick={onClickCloseButton}>
              Close
            </Styled.CloseReplyButton>
          </div>
        )}
        {messageSelected && (
          <Styled.ChatMessage
            isChat={
              selectedMessage?.messageType == ChatMessageMessageTypeEnum.Chat
            }
          >
            {selectedMessage?.body}
          </Styled.ChatMessage>
        )}
      </Styled.ReplyMessageInfo>

      <Styled.ChatMessageForm onSubmit={handleSubmit(onSubmit)}>
        <textarea name="chatMessage" ref={register} />
        <input type="submit" />
        <br />
        {!messageSelected && (
          <div>
            <input type="checkbox" name="isQuestion" ref={register} />
            質問を送る
            <br />
          </div>
        )}
        <ReactButton reactEmoji="👍" roomId={roomId} />
        <ReactButton reactEmoji="👏" roomId={roomId} />
        <ReactButton reactEmoji="🎉" roomId={roomId} />
      </Styled.ChatMessageForm>
    </Styled.Container>
  )
}
