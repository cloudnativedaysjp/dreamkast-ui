import styled from 'styled-components'
import { Tab as MUITab, Tabs } from '@material-ui/core'
import { TabPanel as MUITabPanel } from '@material-ui/lab'

export const OuterContainer = styled.div`
  padding: 0 0 12px 0;
`
export const TabContainer = styled(Tabs)`
  background-color: #fff;
  border-radius: 10px 10px 0 0;
  border-bottom: 1px solid lightgray;
`

export const Tab = styled(MUITab)`
  min-width: 50% !important;
`

export const TabPanel = styled(MUITabPanel)`
  padding: 0px;
`
