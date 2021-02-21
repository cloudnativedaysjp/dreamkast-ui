import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { ChatMessageApi, ChatMessageMessageTypeEnum } from '../../client-axios'
import Button from '@material-ui/core/Button'

type Props = {
  roomId?: number
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
) => {
  return {
    eventAbbr: eventAbbr,
    roomId: roomId,
    roomType: roomType,
    body: body,
    messageType: ChatMessageMessageTypeEnum.Chat,
  }
}

const ChatMessageForm: React.FC<Props> = ({ roomId }) => {
  const api = new ChatMessageApi()
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitSuccessful },
  } = useForm<Inputs>()
  const [submittedData, setSubmittedData] = useState({})

  const onSubmit = (data: Inputs) => {
    if (!roomId) return
    setSubmittedData(data)
    const msg = ChatMessageRequest('cndo2021', roomId, 'talk', data.chatMessage)
    if (data.isQuestion) {
      msg.messageType = ChatMessageMessageTypeEnum.Qa
    }
    api.apiV1ChatMessagesPost(msg)
  }

  const onThumbsUp = () => {
    if (!roomId) return
    const msg = ChatMessageRequest('cndo2021', roomId, 'talk', '👍')
    api.apiV1ChatMessagesPost(msg)
  }
  const onClap = () => {
    if (!roomId) return
    const msg = ChatMessageRequest('cndo2021', roomId, 'talk', '👏')
    api.apiV1ChatMessagesPost(msg)
  }
  const onPartyPopper = () => {
    if (!roomId) return
    const msg = ChatMessageRequest('cndo2021', roomId, 'talk', '🎉')
    api.apiV1ChatMessagesPost(msg)
  }

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset({ chatMessage: '' })
    }
  }, [isSubmitSuccessful, submittedData, reset])

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <textarea name="chatMessage" ref={register} />
      <input type="submit" />
      <br />
      <input type="checkbox" name="isQuestion" ref={register} />
      質問を送る
      <br />
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
