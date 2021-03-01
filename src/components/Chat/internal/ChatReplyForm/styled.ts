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
  padding: 10px !important;
`

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px;
  width: 100%;
`
