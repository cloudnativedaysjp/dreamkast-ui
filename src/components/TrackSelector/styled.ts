import styled from 'styled-components'
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup'
import ToggleButton from '@material-ui/lab/ToggleButton'

export const TrackMenuContainer = styled(ToggleButtonGroup)`
  width: 100%;
  justify-content: space-between;
  padding: 20px 6px;
`

export const MenuItem = styled(ToggleButton)`
  width: 14%;
  border: 1.5px solid !important;
  border-radius: 5px !important;
  background-color: #ffffff;
  &:hover {
    border: 1.5px solid rgba(217, 72, 125, 0.5) !important;
    color: rgba(217, 72, 125, 0.5);
    background-color: rgba(242, 182, 198, 0.3);
  }
  &.Mui-selected {
    border: 1.5px solid rgba(217, 72, 125, 1) !important;
    color: rgba(217, 72, 125, 1);
    background-color: rgba(242, 182, 198, 0.5);
    :hover {
      background-color: rgba(242, 182, 198, 0.3);
    }
  }
`
