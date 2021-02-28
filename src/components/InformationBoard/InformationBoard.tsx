import React, { useState } from 'react'
import { TalkInfo } from '../TalkInfo'
import * as Styled from './styled'
import { TabContext } from '@material-ui/lab'
import { Booths } from '../Booths/Booths'
import { Talk } from '../../client-axios'

type Props = {
  selectedTalk?: Talk
}

export const InformationBoard: React.FC<Props> = ({ selectedTalk }) => {
  const [selectedTab, setSelectedTab] = useState('0')
  const handleChange = (
    _event: React.ChangeEvent<Record<string, never>>,
    newValue: string,
  ) => {
    setSelectedTab(newValue)
  }

  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    }
  }

  return (
    <Styled.OuterContainer>
      <TabContext value={selectedTab}>
        <Styled.TabContainer
          value={selectedTab}
          onChange={handleChange}
          textColor="secondary"
          aria-label="simple tabs example"
        >
          <Styled.Tab label="Session" value="0" {...a11yProps(0)} />
          <Styled.Tab label="Booth" value="1" {...a11yProps(1)} />
        </Styled.TabContainer>
        <Styled.TabPanel value="0">
          <TalkInfo selectedTalk={selectedTalk} />
        </Styled.TabPanel>
        <Styled.TabPanel value="1">
          <Booths />
        </Styled.TabPanel>
      </TabContext>
    </Styled.OuterContainer>
  )
}
