import React from 'react'
import * as Styled from './styled'

type Props = {
  votesCount: number
  hasVoted: boolean
  onVote: () => void
}

export const VoteButton: React.FC<Props> = ({
  votesCount,
  hasVoted,
  onVote,
}) => {
  return (
    <Styled.Button onClick={onVote} hasVoted={hasVoted}>
      <Styled.Icon>{hasVoted ? '👍' : '👍'}</Styled.Icon>
      <Styled.Count>{votesCount}</Styled.Count>
    </Styled.Button>
  )
}
