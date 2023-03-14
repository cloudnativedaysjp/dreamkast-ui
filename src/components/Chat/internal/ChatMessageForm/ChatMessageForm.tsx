import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import * as Styled from './styled'
import { ChatMessageContainer } from '../../../../util/chat'
import { ReactionButton } from '../ReactionButton'
import { Button, Input, Checkbox } from '@material-ui/core'
import { MessageInputs } from '../ChatMessageRequest'

type Props = {
  selectedMessage: ChatMessageContainer
  isVisibleForm: boolean
  checked: boolean
  onCheck: (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean,
  ) => void
  onClickCloseButton: () => void
  onSendMessage: (data: MessageInputs) => void
  onSendQuestion: (data: MessageInputs) => void
}

export const ChatMessageForm: React.FC<Props> = ({
  checked,
  onCheck,
  onSendMessage,
  onSendQuestion,
}) => {
  const CHAT_BODY_MAX_LENGTH = 512
  const {
    register,
    handleSubmit,
    reset,
    watch,
    getValues,
    formState: { errors, isSubmitSuccessful },
  } = useForm<MessageInputs>({
    mode: 'onChange',
    criteriaMode: 'all',
    shouldFocusError: false,
  })
  const [btnDisabled, setBtnDisabled] = useState<boolean>(false)

  const watchChatMessage = watch('chatMessage')

  const handleSendMessage = (data: MessageInputs) => {
    setBtnDisabled(true)
    if (!btnDisabled) onSendMessage(data)
    setTimeout(() => {
      setBtnDisabled(false)
    }, 3000)
  }

  const handleSendQuestion = (data: MessageInputs) => {
    setBtnDisabled(true)
    if (!btnDisabled) onSendQuestion(data)
    setTimeout(() => {
      setBtnDisabled(false)
    }, 3000)
  }

  const handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      const value = getValues()
      if (!value.chatMessage) return
      handleSendMessage(value)
      reset({ chatMessage: '' })
    }
  }

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset({ chatMessage: '' })
    }
  }, [isSubmitSuccessful, reset])

  useEffect(() => {
    setBtnDisabled((watchChatMessage || '').length > CHAT_BODY_MAX_LENGTH)
  }, [watchChatMessage])

  return (
    <Styled.Container>
      {/* {isVisibleForm && ( */}
      <Styled.ChatMessageForm>
        <Styled.CheckBoxContainer>
          <Checkbox size="small" checked={checked} onChange={onCheck} />
          <Styled.label>オートスクロール</Styled.label>
        </Styled.CheckBoxContainer>
        <Styled.TextField
          inputProps={{ 'data-testid': 'message-form' }}
          color="secondary"
          size="small"
          onKeyPress={handleKeyPress}
          {...register('chatMessage', {
            required: true,
            maxLength: CHAT_BODY_MAX_LENGTH,
          })}
        />
        {errors.chatMessage?.types?.maxLength && (
          <Styled.WarningText>
            一度に書き込める最大文字数は{CHAT_BODY_MAX_LENGTH}文字です
          </Styled.WarningText>
        )}

        <Input type="hidden" {...register('isQuestion')} />
        <Styled.ButtonContainer>
          <ReactionButton
            disabled={btnDisabled}
            reactEmoji="👍"
            onSendReply={handleSendMessage}
          />
          <ReactionButton
            disabled={btnDisabled}
            reactEmoji="👏"
            onSendReply={handleSendMessage}
          />
          <ReactionButton
            disabled={btnDisabled}
            reactEmoji="🎉"
            onSendReply={handleSendMessage}
          />
          <Button
            data-testid={'submit-chat'}
            type="submit"
            disabled={!watchChatMessage || btnDisabled}
            variant="contained"
            onClick={handleSubmit(handleSendMessage)}
          >
            送信
          </Button>
          <Button
            data-testid={'submit-qa'}
            type="submit"
            disabled={!watchChatMessage || btnDisabled}
            variant="contained"
            onClick={handleSubmit(handleSendQuestion)}
          >
            質問する
          </Button>
        </Styled.ButtonContainer>
      </Styled.ChatMessageForm>
      {/* )} */}
    </Styled.Container>
  )
}
