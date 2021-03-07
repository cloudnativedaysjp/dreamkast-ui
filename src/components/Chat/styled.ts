import styled from 'styled-components'
import { TabPanel as MUITabPanel } from '@material-ui/lab'
import { Tabs, Tab as MUITab } from '@material-ui/core'

export const Outer = styled.div`
  padding: 5px 5px 5px 0;
`

export const Container = styled.div`
  border-radius: 10px;
`
export const TabContainer = styled(Tabs)`
  background-color: #fff;
  border-radius: 10px 10px 0 0;
  border-bottom: 1px solid lightgray;
`

export const TabPanel = styled(MUITabPanel)`
  padding: 0px;
`

export const Tab = styled(MUITab)`
  min-width: 50% !important;
`
