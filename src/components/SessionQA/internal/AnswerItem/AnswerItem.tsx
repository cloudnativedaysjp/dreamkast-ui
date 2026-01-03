import React from 'react'
import * as Styled from './styled'
import { SessionQuestionAnswer } from '../../../../types/session-qa'
import dayjs from 'dayjs'
import { setupDayjs } from '../../../../util/setupDayjs'

setupDayjs()

type Props = {
  answer: SessionQuestionAnswer
}

export const AnswerItem: React.FC<Props> = ({ answer }) => {
  return (
    <Styled.Container>
      <Styled.AnswerHeader>
        <Styled.SpeakerName>{answer.speaker.name}</Styled.SpeakerName>
        <Styled.AnswerTime>
          {dayjs(answer.created_at).tz().format('HH:mm')}
        </Styled.AnswerTime>
      </Styled.AnswerHeader>
      <Styled.AnswerBody>{answer.body}</Styled.AnswerBody>
    </Styled.Container>
  )
}
