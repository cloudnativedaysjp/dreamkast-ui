import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import {
  ChatMessageApi,
  ChatMessageMessageTypeEnum,
  Configuration,
} from '../../client-axios'
import Button from '@material-ui/core/Button'
import { ChatMessageClass } from './index'

type Props = {
  roomId?: number
  selectedMessage: ChatMessageClass
  onClickCloseButton: () => void
}

type Inputs = {
  chatMessage: string
  isQuestion: boolean
}

const ChatMessageRequest = (
  eventAbbr: string,
  roomId: number,
  roomType: string,
  body: string,
  replyTo: number | null,
) => {
  return {
    eventAbbr: eventAbbr,
    roomId: roomId,
    roomType: roomType,
    body: body,
    messageType: ChatMessageMessageTypeEnum.Chat,
    replyTo: replyTo,
  }
}

const ChatMessageForm: React.FC<Props> = ({
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
  useEffect(() => {
    console.log(selectedMessage)
    console.log(messageSelected)
  }, [])

  const onSubmit = (data: Inputs) => {
    if (!roomId) return
    const api = new ChatMessageApi(
      new Configuration({ basePath: window.location.origin }),
    )
    setSubmittedData(data)
    api.apiV1ChatMessagesPost(createChatMessageRequest(data, roomId))
  }

  const onThumbsUp = () => {
    if (!roomId) return
    const api = new ChatMessageApi(
      new Configuration({ basePath: window.location.origin }),
    )

    const msg = ChatMessageRequest('cndo2021', roomId, 'talk', '👍', null)
    api.apiV1ChatMessagesPost(msg)
  }
  const onClap = () => {
    if (!roomId) return
    const api = new ChatMessageApi(
      new Configuration({ basePath: window.location.origin }),
    )

    const msg = ChatMessageRequest('cndo2021', roomId, 'talk', '👏', null)
    api.apiV1ChatMessagesPost(msg)
  }
  const onPartyPopper = () => {
    if (!roomId) return
    const api = new ChatMessageApi(
      new Configuration({ basePath: window.location.origin }),
    )

    const msg = ChatMessageRequest('cndo2021', roomId, 'talk', '🎉', null)
    api.apiV1ChatMessagesPost(msg)
  }

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset({ chatMessage: '' })
    }
  }, [isSubmitSuccessful, submittedData, reset])

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {messageSelected && <p onClick={onClickCloseButton}>Close</p>}
      {messageSelected && <p>{selectedMessage.body}</p>}
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
      <Button onClick={onThumbsUp} variant="contained">
        👍
      </Button>
      <Button onClick={onClap} variant="contained">
        👏
      </Button>
      <Button onClick={onPartyPopper} variant="contained">
        🎉
      </Button>
    </form>
  )
}

export default ChatMessageForm
