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

export const MenuButton = styled.button`
  padding: 4px 8px;
  background-color: transparent;
  color: #666;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 18px;
  line-height: 1;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  &:hover {
    background-color: #f5f5f5;
    color: #333;
  }
`

export const MenuOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 998;
`

export const Menu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 4px;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 999;
  min-width: 120px;
`

export const MenuItem = styled.button`
  width: 100%;
  padding: 8px 16px;
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
  font-size: 14px;
  color: #333;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f5f5f5;
  }

  &:first-child {
    border-radius: 4px 4px 0 0;
  }

  &:last-child {
    border-radius: 0 0 4px 4px;
  }
`
