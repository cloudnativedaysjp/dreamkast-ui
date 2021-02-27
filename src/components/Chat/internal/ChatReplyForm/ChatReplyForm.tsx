import React from 'react'
import { useForm } from 'react-hook-form'
import * as Styled from './styled'
import { Button, IconButton } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import { MessageInputs } from '../ChatMessageRequest'

type Props = {
  onClickCloseButton: () => void
  onSendReply: (data: MessageInputs) => void
}

type Inputs = {
  chatMessage: string
}

export const ChatReplyForm: React.FC<Props> = ({
  onClickCloseButton,
  onSendReply,
}) => {
  const { register, handleSubmit, watch } = useForm<Inputs>()
  const watchChatMessage = watch('chatMessage')

  return (
    <Styled.Paper>
      <Styled.ChatReplyForm onSubmit={handleSubmit(onSendReply)}>
        <Styled.TextField
          name="chatMessage"
          color="secondary"
          size="small"
          inputRef={register}
          multiline
        />
        <IconButton
          aria-label="close"
          size="small"
          onClick={onClickCloseButton}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
        <Styled.ButtonContainer>
          <Button
            type="submit"
            disabled={!watchChatMessage}
            variant="contained"
          >
            送信
          </Button>
        </Styled.ButtonContainer>
      </Styled.ChatReplyForm>
    </Styled.Paper>
  )
}
