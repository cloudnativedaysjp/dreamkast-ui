import React from 'react'
import * as Styled from './styled'
import { Talk } from '../../client-axios'

type Props = {
  selectedTalk?: Talk
}

export const TalkInfo: React.FC<Props> = ({ selectedTalk }) => (
  <Styled.OuterContainer>
    <Styled.Container>
      <Styled.Title>{selectedTalk?.title}</Styled.Title>
      <h3>{selectedTalk?.speakers.join(' / ')}</h3>
      <Styled.Content>{selectedTalk?._abstract}</Styled.Content>
    </Styled.Container>
  </Styled.OuterContainer>
)
