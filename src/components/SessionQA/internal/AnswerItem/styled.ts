import styled from 'styled-components'

export const Container = styled.div`
  margin-bottom: 8px;
  padding: 8px;
  background: #f9f9f9;
  border-left: 3px solid #1976d2;
  border-radius: 4px;
`

export const AnswerHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
`

export const SpeakerName = styled.span`
  font-weight: bold;
  font-size: 12px;
  color: #1976d2;
`

export const AnswerTime = styled.span`
  font-size: 11px;
  color: #666;
`

export const AnswerBody = styled.div`
  font-size: 13px;
  line-height: 1.5;
  color: #333;
  white-space: pre-wrap;
  word-wrap: break-word;
`
