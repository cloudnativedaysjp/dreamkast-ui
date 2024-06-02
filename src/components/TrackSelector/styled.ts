import styled from 'styled-components'
import ToggleButton from '@material-ui/lab/ToggleButton'
import { Button, IconButton, Modal } from '@material-ui/core'
import { ToggleButtonGroup } from '@material-ui/lab'

export const TrackMenuContainer = styled.div`
  width: 100%;
  justify-content: space-between;
  padding: 20px 0;
`

export const TrackSelectorButtonGroup = styled(ToggleButtonGroup)`
  width: calc(100% - 105px);
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

export const OptionButtonGroup = styled.div`
  float: right;
`

export const LiveTalkModalButton = styled(IconButton)`
  width: 49.2px;
  height: 49.2px;
  border-radius: 5px;
  border: 1.5px solid rgba(66, 58, 87, 0.5);
  background-color: #ffffff;
`

export const ShowLTButton = styled(IconButton)`
  width: 49.2px;
  height: 49.2px;
  border-radius: 5px;
  margin-left: -1px;
  border: 1.5px solid rgba(66, 58, 87, 0.5);
  background-color: #ffffff;
`

export const LiveTalkModal = styled(Modal)`
  width: 100vw;
`

export const Container = styled.div`
  width: 90%;
  max-width: 600px;
  top: 50%;
  left: 50%;
  position: absolute;
  transform: translate(-50%, -50%);
`

export const InnerContainer = styled.div`
  width: 100%;
  min-height: 320px;
  background-color: #fff;
  border-radius: 10px;
`

export const Title = styled.div`
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  padding: 10px;
  border-bottom: 1px solid #888;
  border-radius: 10px 10px 0px 0px;
  background-color: #ffffff;
  color: #423a57;
`

export const List = styled.div`
  padding: 5px 5px 10px;
`

export const TrackSelectorButton = styled(Button)`
  width: 120px;
  height: 50px;
  border: 1.5px solid !important;
  border-radius: 5px !important;
  background-color: #ffffff;
  &:hover {
    border: 1.5px solid rgba(66, 58, 87, 0.5) !important;
    color: rgba(66, 58, 87, 0.5);
    background-color: rgba(154, 127, 184, 0.3);
  }
  &.selected {
    border: 1.5px solid rgba(66, 58, 87, 1) !important;
    color: rgba(66, 58, 87, 1);
    background-color: rgba(154, 127, 184, 0.5);
    :hover {
      background-color: rgba(154, 127, 184, 0.3);
    }
  }
`
export const Live = styled.span`
  font-weight: bold;
  background-color: red;
  padding: 2px;
  color: white;
  border-radius: 3px;
`
