import styled from 'styled-components'
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup'
import ToggleButton from '@material-ui/lab/ToggleButton'

export const TrackMenuContainer = styled(ToggleButtonGroup)`
  width: 100%;
  justify-content: space-between;
  padding: 12px 6px;
`

export const MenuItem = styled(ToggleButton)`
  width: 14%;
  border: 1.5px solid !important;
  border-radius: 5px !important;
`
