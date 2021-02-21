import React from 'react'
import * as Styled from './styled'
import { Talk } from '../../client-axios'

type Props = {
  selectedTalk?: Talk
}

export const TalkInfo: React.FC<Props> = ({ selectedTalk }) => (
  <Styled.OuterContainer>
    <Styled.Container>
      <h2>{selectedTalk?.title}</h2>
      <h3>{selectedTalk?.speakers.join(' / ')}</h3>
      <div>{selectedTalk?._abstract}</div>
    </Styled.Container>
  </Styled.OuterContainer>
)
