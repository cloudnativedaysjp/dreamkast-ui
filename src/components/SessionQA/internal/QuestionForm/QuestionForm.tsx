import React from 'react'
import { useForm } from 'react-hook-form'
import * as Styled from './styled'

type FormData = {
  body: string
}

type Props = {
  isVisibleForm: boolean
  onSubmit: (body: string) => void
}

export const QuestionForm: React.FC<Props> = ({ isVisibleForm, onSubmit }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm<FormData>()

  const bodyValue = watch('body', '')
  const bodyLength = bodyValue?.length || 0
  const btnDisabled = bodyLength === 0

  const onFormSubmit = (data: FormData) => {
    if (!data.body || btnDisabled) {
      return
    }

    onSubmit(data.body.trim())
    reset({ body: '' })
  }

  if (!isVisibleForm) {
    return null
  }

  return (
    <Styled.Container>
      <Styled.Form onSubmit={handleSubmit(onFormSubmit)}>
        <Styled.TextArea
          {...register('body', {
            required: '質問を入力してください',
          })}
          placeholder="質問を入力してください"
          rows={3}
        />
        {errors.body && (
          <Styled.ErrorText>{errors.body.message}</Styled.ErrorText>
        )}
        <Styled.Footer>
          <Styled.CharCount>
            {bodyLength}文字
          </Styled.CharCount>
          <Styled.SubmitButton type="submit" disabled={btnDisabled}>
            質問を投稿
          </Styled.SubmitButton>
        </Styled.Footer>
      </Styled.Form>
    </Styled.Container>
  )
}
