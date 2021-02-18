import React from 'react'
import { Talk } from '../../client-axios'

type Props = {
  selectedTalk?: Talk
}

export const TalkInfo: React.FC<Props> = ({ selectedTalk }) => (
  <section className="talk-info">
    <h3>{selectedTalk?.title}</h3>
    <h4>{selectedTalk?.speakers.join(' / ')}</h4>
    <div>{selectedTalk?.abstract}</div>
  </section>
)