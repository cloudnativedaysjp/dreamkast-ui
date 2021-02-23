import React, { useEffect, useState } from 'react'
import { Tab, Tabs } from '@material-ui/core'
import {
  ChatMessage as ChatMessageInterface,
  ChatMessageApi,
  ChatMessageMessageTypeEnum,
  Talk,
  Configuration,
} from '../../client-axios'
import ChatMessageForm from './ChatMessageForm'
import ActionCable from 'actioncable'
import { ChatMessageClass } from './index'
import { TabContext, TabPanel } from '@material-ui/lab'
import { ChatBox } from './ChatBox'

type Props = {
  talk?: Talk
}

export const Chat: React.FC<Props> = ({ talk }) => {
  const [messages, setMessages] = useState<ChatMessageInterface[]>([])
  const fetchChatMessagesFromAPI = (api: ChatMessageApi) => {
    if (!talk) return
    api
      .apiV1ChatMessagesGet('cndo2021', String(talk.id), 'talk')
      .then((res) => {
        if (typeof res.data !== 'object') {
          // Chatのwebsocketがエラーを返した場合はログインさせるためにトップページへリダイレクト
          window.location.href = `${window.location.href.replace(/ui/g, '')}`
        }
        setMessages(res.data)
      })
  }

  useEffect(() => {
    const api = new ChatMessageApi(
      new Configuration({ basePath: window.location.origin }),
    )

    if (!talk) return
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const actionCable = require('actioncable')

    fetchChatMessagesFromAPI(api)
    let wsUrl = ''
    if (window.location.protocol == 'http:') {
      wsUrl = `ws://${window.location.host}/cable`
    } else {
      wsUrl = `wss://${window.location.host}/cable`
    }
    const cableApp: ActionCable.Cable = actionCable.createConsumer(wsUrl)
    if (cableApp) {
      cableApp.disconnect()
    }
    cableApp.subscriptions.create(
      { channel: 'ChatChannel', roomType: 'talk', roomId: talk.id },
      {
        received(receivedMsg: {
          id: number
          profileId: number
          speakerId: number
          eventAbbr: string
          roomId: number
          roomType: string
          body: string
          messageType: ChatMessageMessageTypeEnum
        }) {
          const msg = new ChatMessageClass(
            receivedMsg.id,
            receivedMsg.profileId,
            receivedMsg.speakerId,
            receivedMsg.eventAbbr,
            receivedMsg.roomId,
            receivedMsg.roomType,
            receivedMsg.body,
            receivedMsg.messageType,
          )
          setMessages((messages) => messages.concat(msg))
        },
      },
    )
  }, [talk])

  const [selectedTab, setSelectedTab] = useState('0')

  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    }
  }
  // eslint-disable-next-line @typescript-eslint/ban-types
  const handleChange = (_event: React.ChangeEvent<{}>, newValue: string) => {
    setSelectedTab(newValue)
  }
  return (
    <div>
      <TabContext value={selectedTab}>
        <Tabs
          value={selectedTab}
          onChange={handleChange}
          aria-label="simple tabs example"
        >
          <Tab label="Chat / QA" value="0" {...a11yProps(0)} />
          <Tab label="QA Only" value="1" {...a11yProps(1)} />
        </Tabs>

        <TabPanel value="0">
          <ChatBox
            messages={messages}
            messageTypes={[
              ChatMessageMessageTypeEnum.Chat,
              ChatMessageMessageTypeEnum.Qa,
            ]}
          />
          <ChatMessageForm roomId={talk?.id} />
        </TabPanel>
        <TabPanel value="1">
          <ChatBox
            messages={messages}
            messageTypes={[ChatMessageMessageTypeEnum.Qa]}
          />
          <ChatMessageForm roomId={talk?.id} />
        </TabPanel>
      </TabContext>
    </div>
  )
}
