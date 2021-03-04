import styled from 'styled-components'
import { Paper as MuiPaper, TextField as MuiTextField } from '@material-ui/core'

export const Paper = styled(MuiPaper)`
  padding: 10px;
  margin: 8px 8px 8px 30px;
  background-color: #ffffff;
`

export const ChatReplyForm = styled.form``

export const TextField = styled(MuiTextField)`
  width: 100%;
  padding: 4px !important;
`

export const ButtonGroupContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 135px;
`

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 4px;
  width: 100%;
`
