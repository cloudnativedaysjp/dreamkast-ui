import React from 'react'
import * as Styled from './styled'
import { MessageInputs } from '../ChatMessageRequest'
import { useForm } from 'react-hook-form'
import { Input } from '@material-ui/core'

type Props = {
  reactEmoji: string
  disabled?: boolean
  onSendReply: (data: MessageInputs) => void
}

export const ReactionButton: React.FC<Props> = ({
  reactEmoji,
  disabled,
  onSendReply,
}) => {
  const { register, handleSubmit } = useForm<MessageInputs>()

  return (
    <Styled.ChatMessageForm>
      <Input type="hidden" value={reactEmoji} {...register('chatMessage')} />
      <Styled.ReactButton
        type="submit"
        disabled={disabled}
        onClick={handleSubmit(onSendReply)}
        variant="contained"
      >
        {reactEmoji}
      </Styled.ReactButton>
    </Styled.ChatMessageForm>
  )
}
