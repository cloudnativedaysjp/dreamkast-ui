import React, { useState } from 'react'
import * as Styled from './styled'
import { VoteButton } from '../../VoteButton'
import { SpeakerAnswerForm } from '../../SpeakerAnswerForm'
import { AnswerItem } from '../../AnswerItem'
import { SessionQuestion } from '../../../../../types/session-qa'
import dayjs from 'dayjs'
import { setupDayjs } from '../../../../../util/setupDayjs'

setupDayjs()

type Props = {
  question: SessionQuestion
  isSpeaker: boolean
  onVote: (questionId: number) => void
  onAnswerSubmit: (questionId: number, body: string) => void
}

export const QuestionItem: React.FC<Props> = ({
  question,
  isSpeaker,
  onVote,
  onAnswerSubmit,
}) => {
  const [showAnswerForm, setShowAnswerForm] = useState(false)

  return (
    <Styled.Container>
      <Styled.QuestionHeader>
        <Styled.QuestionMeta>
          <Styled.QuestionAuthor>{question.profile.name}</Styled.QuestionAuthor>
          <Styled.QuestionTime>
            {dayjs(question.created_at).tz().format('HH:mm')}
          </Styled.QuestionTime>
        </Styled.QuestionMeta>
        <VoteButton
          votesCount={question.votes_count}
          hasVoted={question.has_voted}
          onVote={() => onVote(question.id)}
        />
      </Styled.QuestionHeader>
      <Styled.QuestionBody>{question.body}</Styled.QuestionBody>
      {question.answers.length > 0 && (
        <Styled.AnswersContainer>
          {question.answers.map((answer) => (
            <AnswerItem key={answer.id} answer={answer} />
          ))}
        </Styled.AnswersContainer>
      )}
      {isSpeaker && (
        <Styled.AnswerSection>
          {!showAnswerForm ? (
            <Styled.ShowAnswerButton onClick={() => setShowAnswerForm(true)}>
              回答する
            </Styled.ShowAnswerButton>
          ) : (
            <SpeakerAnswerForm
              onSubmit={(body) => {
                onAnswerSubmit(question.id, body)
                setShowAnswerForm(false)
              }}
              onCancel={() => setShowAnswerForm(false)}
            />
          )}
        </Styled.AnswerSection>
      )}
    </Styled.Container>
  )
}
