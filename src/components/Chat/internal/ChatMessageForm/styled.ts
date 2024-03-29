import styled from 'styled-components'
import { Paper, TextField as MuiTextField } from '@material-ui/core'

export const Container = styled.div`
  background-color: #fff;
  border-top: 1px solid lightgray;
  border-radius: 0 0 10px 10px;
  min-height: 20px;
`

export const ChatMessage = styled(Paper)<{ isChat: boolean }>`
  padding: 10px;
  margin: 5px;
  background-color: ${({ isChat }) => (isChat ? '#ffffff' : '#c8f2f7')};
  white-space: pre-wrap;
  overflow-y: hidden;
  word-break: break-word;
`

export const ReplyMessageInfo = styled.div`
  padding: 10px;
`

export const ReplyTitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`

export const QuestionChecker = styled.div`
  display: flex;
  align-items: center;
`

export const ChatMessageForm = styled.form``

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px;
  width: 100%;
`

export const TextField = styled(MuiTextField)`
  width: 100%;
  padding: 2px 10px !important;
`
export const WarningText = styled.div`
  width: 100%;
  padding: 2px 10px !important;
`

export const CheckBoxContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
`

export const label = styled.div``
