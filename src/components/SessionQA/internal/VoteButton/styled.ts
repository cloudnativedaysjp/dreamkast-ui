import styled from 'styled-components'

export const Button = styled.button<{ hasVoted: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border: 1px solid ${(props) => (props.hasVoted ? '#1976d2' : '#ccc')};
  border-radius: 4px;
  background: ${(props) => (props.hasVoted ? '#e3f2fd' : 'white')};
  cursor: pointer;
  font-size: 12px;

  &:hover {
    background: ${(props) => (props.hasVoted ? '#bbdefb' : '#f5f5f5')};
  }
`

export const Icon = styled.span`
  font-size: 16px;
`

export const Count = styled.span`
  font-weight: bold;
  color: #333;
`
