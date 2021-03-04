import React from 'react'
import { useForm } from 'react-hook-form'
import * as Styled from './styled'
import { Button } from '@material-ui/core'
import { MessageInputs } from '../ChatMessageRequest'
import { ReactionButton } from '../ReactionButton'

type Props = {
  onClickCloseButton: () => void
  onSendReply: (data: MessageInputs) => void
}

export const ChatReplyForm: React.FC<Props> = ({
  onClickCloseButton,
  onSendReply,
}) => {
  const { register, handleSubmit, watch, getValues } = useForm<MessageInputs>({
    defaultValues: { isQuestion: false },
  })
  const watchChatMessage = watch('chatMessage')

  const handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      const value = getValues()
      if (!value.chatMessage) return
      onSendReply(value)
    }
  }

  return (
    <Styled.Paper>
      <Styled.ChatReplyForm onSubmit={handleSubmit(onSendReply)}>
        <Styled.TextField
          name="chatMessage"
          color="secondary"
          size="small"
          inputRef={register}
          onKeyPress={handleKeyPress}
        />
        <Styled.ButtonContainer>
          <ReactionButton reactEmoji="👍" onSendReply={onSendReply} />
          <Styled.ButtonGroupContainer>
            <Button
              type="submit"
              color="primary"
              onClick={onClickCloseButton}
              variant="contained"
            >
              取消
            </Button>
            <Button
              type="submit"
              disabled={!watchChatMessage}
              variant="contained"
            >
              送信
            </Button>
          </Styled.ButtonGroupContainer>
        </Styled.ButtonContainer>
      </Styled.ChatReplyForm>
    </Styled.Paper>
  )
}
