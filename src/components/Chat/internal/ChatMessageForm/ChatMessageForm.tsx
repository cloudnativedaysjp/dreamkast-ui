import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import * as Styled from './styled'
import { ChatMessageClass } from '../../../../util/chat'
import { ReactButton } from './internal/ReactButton'
import { Button, Checkbox } from '@material-ui/core'
import { MessageInputs } from '../ChatMessageRequest'

type Props = {
  roomId?: number
  selectedMessage: ChatMessageClass
  onClickCloseButton: () => void
  onSendMessage: (data: MessageInputs) => void
}

export const ChatMessageForm: React.FC<Props> = ({ roomId, onSendMessage }) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { isSubmitSuccessful },
  } = useForm<MessageInputs>()

  const watchChatMessage = watch('chatMessage')

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset({ chatMessage: '' })
    }
  }, [isSubmitSuccessful, reset])

  return (
    <Styled.Container>
      <Styled.ChatMessageForm onSubmit={handleSubmit(onSendMessage)}>
        <Styled.TextField
          name="chatMessage"
          color="secondary"
          size="small"
          inputRef={register}
          multiline
        />
        <Styled.QuestionChecker>
          <Checkbox
            color="secondary"
            size="small"
            name="isQuestion"
            inputRef={register}
          />
          質問を送る
        </Styled.QuestionChecker>
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
