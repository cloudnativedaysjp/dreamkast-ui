import React, { useEffect, useState } from 'react'
import * as Styled from './styled'
import { MessageInputs } from '../ChatMessageRequest'
import { useForm } from 'react-hook-form'
import { Input } from '@material-ui/core'

type Props = {
  reactEmoji: string
  onSendReply: (data: MessageInputs) => void
}

export const ReactionButton: React.FC<Props> = ({
  reactEmoji,
  onSendReply,
}) => {
  const {
    register,
    handleSubmit,
    formState: { isSubmitSuccessful },
  } = useForm<MessageInputs>()
  const [buttonDisabled, setButtonDisabled] = useState(false)

  useEffect(() => {
    if (isSubmitSuccessful) {
      setButtonDisabled(true)
      setTimeout(() => {
        setButtonDisabled(false)
      }, 3000)
    }
  }, [isSubmitSuccessful])

  return (
    <Styled.ChatMessageForm>
      <Input
        type="hidden"
        name="chatMessage"
        value={reactEmoji}
        inputRef={register}
      />
      <Styled.ReactButton
        type="submit"
        onClick={handleSubmit(onSendReply)}
        disabled={buttonDisabled}
        variant="contained"
      >
        {reactEmoji}
      </Styled.ReactButton>
    </Styled.ChatMessageForm>
  )
}
