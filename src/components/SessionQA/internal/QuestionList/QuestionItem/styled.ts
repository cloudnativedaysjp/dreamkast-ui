import styled from 'styled-components'

export const Container = styled.div`
  margin-bottom: 16px;
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: white;
`

export const QuestionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
`

export const QuestionMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

export const QuestionAuthor = styled.span`
  font-weight: bold;
  font-size: 14px;
  color: #333;
`

export const QuestionTime = styled.span`
  font-size: 12px;
  color: #666;
`

export const QuestionBody = styled.div`
  margin-bottom: 12px;
  font-size: 14px;
  line-height: 1.5;
  color: #333;
  white-space: pre-wrap;
  word-wrap: break-word;
`

export const AnswersContainer = styled.div`
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #e0e0e0;
`

export const AnswerSection = styled.div`
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #e0e0e0;
`

export const ShowAnswerButton = styled.button`
  padding: 6px 12px;
  background-color: #1976d2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;

  &:hover {
    background-color: #1565c0;
  }
`

export const DeleteButton = styled.button`
  padding: 4px 8px;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  line-height: 1;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: #d32f2f;
  }
`
