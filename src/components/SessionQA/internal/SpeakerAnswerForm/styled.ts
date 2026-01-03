import styled from 'styled-components'

export const Container = styled.div`
  padding: 8px;
  background: #f9f9f9;
  border-radius: 4px;
`

export const Form = styled.form`
  display: flex;
  flex-direction: column;
`

export const TextArea = styled.textarea`
  width: 100%;
  padding: 6px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 13px;
  resize: vertical;
  min-height: 50px;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: #1976d2;
  }
`

export const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 6px;
`

export const CharCount = styled.span`
  font-size: 11px;
  color: #666;
`

export const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
`

export const CancelButton = styled.button`
  padding: 6px 12px;
  background-color: #f5f5f5;
  color: #333;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;

  &:hover {
    background-color: #e0e0e0;
  }
`

export const SubmitButton = styled.button`
  padding: 6px 12px;
  background-color: #1976d2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;

  &:hover:not(:disabled) {
    background-color: #1565c0;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`

export const ErrorText = styled.div`
  color: #d32f2f;
  font-size: 11px;
  margin-top: 4px;
`
