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
  isOwnQuestion: boolean
  onVote: (questionId: number) => void
  onAnswerSubmit: (questionId: number, body: string) => void
  onDeleteQuestion: (questionId: number) => void
}

export const QuestionItem: React.FC<Props> = ({
  question,
  isSpeaker,
  isOwnQuestion,
  onVote,
  onAnswerSubmit,
  onDeleteQuestion,
}) => {
  const [showAnswerForm, setShowAnswerForm] = useState(false)
  const [showMenu, setShowMenu] = useState(false)

  return (
    <Styled.Container>
      <Styled.QuestionHeader>
        <Styled.QuestionMeta>
          <Styled.QuestionTime>
            {dayjs(question.created_at).tz().format('HH:mm')}
          </Styled.QuestionTime>
        </Styled.QuestionMeta>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', position: 'relative' }}>
          <VoteButton
            votesCount={question.votes_count}
            hasVoted={question.has_voted}
            onVote={() => onVote(question.id)}
          />
          {isOwnQuestion && (
            <>
              <Styled.MenuButton
                onClick={() => setShowMenu(!showMenu)}
                title="メニュー"
              >
                ⋯
              </Styled.MenuButton>
              {showMenu && (
                <>
                  <Styled.MenuOverlay onClick={() => setShowMenu(false)} />
                  <Styled.Menu>
                    <Styled.MenuItem
                      onClick={() => {
                        onDeleteQuestion(question.id)
                        setShowMenu(false)
                      }}
                    >
                      削除
                    </Styled.MenuItem>
                  </Styled.Menu>
                </>
              )}
            </>
          )}
        </div>
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
