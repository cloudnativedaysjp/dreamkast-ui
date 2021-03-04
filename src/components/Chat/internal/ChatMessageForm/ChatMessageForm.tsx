import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import * as Styled from './styled'
import { ChatMessageClass } from '../../../../util/chat'
import { ReactionButton } from '../ReactionButton'
import { Button, Input } from '@material-ui/core'
import { MessageInputs } from '../ChatMessageRequest'

type Props = {
  selectedMessage: ChatMessageClass
  isArchive: boolean
  onClickCloseButton: () => void
  onSendMessage: (data: MessageInputs) => void
  onSendQuestion: (data: MessageInputs) => void
}

export const ChatMessageForm: React.FC<Props> = ({
  isArchive,
  onSendMessage,
  onSendQuestion,
}) => {
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
      {isArchive && (
        <Styled.ChatMessageForm>
          <Styled.TextField
            name="chatMessage"
            color="secondary"
            size="small"
            inputRef={register}
            multiline
          />
          <Input type="hidden" name="isQuestion" inputRef={register} />
          <Styled.ButtonContainer>
            <ReactionButton reactEmoji="👍" onSendReply={onSendMessage} />
            <ReactionButton reactEmoji="👏" onSendReply={onSendMessage} />
            <ReactionButton reactEmoji="🎉" onSendReply={onSendMessage} />
            <Button
              type="submit"
              disabled={!watchChatMessage}
              variant="contained"
              onClick={handleSubmit(onSendMessage)}
            >
              送信
            </Button>
            <Button
              type="submit"
              disabled={!watchChatMessage}
              variant="contained"
              onClick={handleSubmit(onSendQuestion)}
            >
              質問する
            </Button>
          </Styled.ButtonContainer>
        </Styled.ChatMessageForm>
      )}
    </Styled.Container>
  )
}
