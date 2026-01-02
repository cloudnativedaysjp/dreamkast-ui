import React, { useEffect, useRef } from 'react'
import * as Styled from './styled'
import { QuestionItem } from './QuestionItem'
import { SessionQuestion } from '../../../../types/session-qa'

type Props = {
  questions: SessionQuestion[]
  isLoading: boolean
  autoScroll: boolean
  isSpeaker: boolean
  onVote: (questionId: number) => void
  onAnswerSubmit: (questionId: number, body: string) => void
}

export const QuestionList: React.FC<Props> = ({
  questions,
  isLoading,
  autoScroll,
  isSpeaker,
  onVote,
  onAnswerSubmit,
}) => {
  const boxRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (autoScroll && boxRef.current) {
      boxRef.current.scrollTop = boxRef.current.scrollHeight
    }
  }, [questions, autoScroll])

  if (isLoading) {
    return (
      <Styled.Box ref={boxRef}>
        <Styled.LoadingText>読み込み中...</Styled.LoadingText>
      </Styled.Box>
    )
  }

  if (questions.length === 0) {
    return (
      <Styled.Box ref={boxRef}>
        <Styled.EmptyText>まだ質問がありません</Styled.EmptyText>
      </Styled.Box>
    )
  }

  return (
    <Styled.Box ref={boxRef}>
      {questions.map((question) => (
        <QuestionItem
          key={question.id}
          question={question}
          isSpeaker={isSpeaker}
          onVote={onVote}
          onAnswerSubmit={onAnswerSubmit}
        />
      ))}
    </Styled.Box>
  )
}
