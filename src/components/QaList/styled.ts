import styled from 'styled-components'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { Card, IconButton, Modal, Typography } from '@material-ui/core'

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

export const SelectTalkModalButton = styled(IconButton)`
  float: right;
  width: 49.2px;
  height: 49.2px;
  margin-left: 5px;
  border-radius: 5px;
  border: 1.5px solid rgba(66, 58, 87, 0.5);
  background-color: #ffffff;
`
export const SelectTalkModal = styled(Modal)`
  width: 100vw;
`
