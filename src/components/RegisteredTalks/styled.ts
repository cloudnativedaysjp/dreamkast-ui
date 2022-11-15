import styled from 'styled-components'
import { Card, Typography } from '@material-ui/core'

export const Container = styled.div`
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.7);
  padding: 10px;
  height: 100%;
`

export const TalkContainer = styled(Card)`
  margin-bottom: 10px;
  background: rgba(255, 255, 255, 1);
`
export const TalkInfo = styled(Typography)`
  fontsize: 14;
`

export const Pos = styled(Typography)`
  marginbottom: 12;
`
