import styled from 'styled-components'
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup'
import ToggleButton from '@material-ui/lab/ToggleButton'
import { IconButton, Modal } from '@material-ui/core'

export const TrackMenuContainer = styled(ToggleButtonGroup)`
  width: 100%;
  justify-content: space-between;
  padding: 20px 0;
`

export const MenuItem = styled(ToggleButton)`
  width: 100%;
  border: 1.5px solid !important;
  border-radius: 5px !important;
  background-color: #ffffff;
  &:hover {
    border: 1.5px solid rgba(66, 58, 87, 0.5) !important;
    color: rgba(66, 58, 87, 0.5);
    background-color: rgba(154, 127, 184, 0.3);
  }
  &.Mui-selected {
    border: 1.5px solid rgba(66, 58, 87, 1) !important;
    color: rgba(66, 58, 87, 1);
    background-color: rgba(154, 127, 184, 0.5);
    :hover {
      background-color: rgba(154, 127, 184, 0.3);
    }
  }
`

export const LiveTalkModalButton = styled(IconButton)`
  margin-left: 5px;
  border-radius: 5px;
  border: 1.5px solid rgba(66, 58, 87, 0.5);
  background-color: #ffffff;
`

export const LiveTalkModal = styled(Modal)`
  width: 100vw;
`

export const Container = styled.div`
  width: 90%;
  min-height: 400px;
  max-width: 500px;
  top: 50%;
  left: 50%;
  position: absolute;
  transform: translate(-50%, -50%);
`

export const InnerContainer = styled.div`
  width: 100%;
  height: 100%;
  background-color: #fff;
  padding: 10px;
`
