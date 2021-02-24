import React, { useEffect, useState } from 'react'
import { Tab, Tabs } from '@material-ui/core'
import {
  ChatMessageApi,
  ChatMessageMessageTypeEnum,
  Talk,
  Configuration,
} from '../../client-axios'
import ChatMessageForm from './ChatMessageForm'
import ActionCable from 'actioncable'
import { ChatMessageClass, ChatMessageMap } from './index'
import { TabContext, TabPanel } from '@material-ui/lab'
import { ChatBox } from './ChatBox'

type Props = {
  talk?: Talk
}

type ReceivedMsg = {
  id: number
  profileId: number
  speakerId: number
  eventAbbr: string
  roomId: number
  roomType: string
  body: string
  messageType: ChatMessageMessageTypeEnum
  replyTo: number
}

export const Chat: React.FC<Props> = ({ talk }) => {
  const initialChatMessageMap = new ChatMessageMap()
  const initialChatMessage = {
    eventAbbr: 'cndo2021',
    body: '',
    messageType: ChatMessageMessageTypeEnum.Chat,
  }
  const [selectedTab, setSelectedTab] = useState('0')
  const [messages, setMessages] = useState<ChatMessageMap>(
    initialChatMessageMap,
  )
  const [selectedMessage, setSelectedMessage] = useState<ChatMessageClass>(
    initialChatMessage,
  )
  const actionCableUrl = () => {
    if (window.location.protocol == 'http:') {
      return `ws://${window.location.host}/cable`
    } else {
      return `wss://${window.location.host}/cable`
    }
  }
  const fetchChatMessagesFromAPI = () => {
    const api = new ChatMessageApi(
      new Configuration({ basePath: window.location.origin }),
    )
    return api
      .apiV1ChatMessagesGet('cndo2021', String(talk?.id), 'talk')
      .then((res) => {
        if (typeof res.data !== 'object') {
          // Chatのwebsocketがエラーを返した場合はログインさせるためにトップページへリダイレクト
          window.location.href = `${window.location.href.replace(/\/ui\//g, '')}`
        }
        if (!messages) setMessages(new ChatMessageMap())
        messages.clear()
        res.data.forEach((receivedMsg) => {
          messages.addMessage(receivedMsg)
        })
        setMessages(new ChatMessageMap(messages))
      })
  }

  const cableReceived = (receivedMsg: ReceivedMsg) => {
    if (!messages) return
    const msg = new ChatMessageClass(
      receivedMsg.id,
      receivedMsg.profileId,
      receivedMsg.speakerId,
      receivedMsg.eventAbbr,
      receivedMsg.roomId,
      receivedMsg.roomType,
      receivedMsg.body,
      receivedMsg.messageType,
      receivedMsg.replyTo,
    )
    messages.addMessage(msg)
    setMessages(messages)
  }

  useEffect(() => {
    if (!talk || !messages) return
    setSelectedMessage(initialChatMessage)
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const actionCable = require('actioncable')
    fetchChatMessagesFromAPI()
    const wsUrl = actionCableUrl()
    const cableApp: ActionCable.Cable = actionCable.createConsumer(wsUrl)
    if (cableApp) {
      cableApp.disconnect()
    }
    cableApp.subscriptions.create(
      { channel: 'ChatChannel', roomType: 'talk', roomId: talk.id },
      {
        received: cableReceived,
      },
    )
  }, [talk])

  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    }
  }
  const handleChange = (
    _event: React.ChangeEvent<Record<string, never>>,
    newValue: string,
  ) => {
    setSelectedTab(newValue)
  }

  const onClickMessage = (e: React.MouseEvent<HTMLInputElement>) => {
    if (!messages || Object.keys(messages).length == 0) return
    const selectedMessageId = e.currentTarget.getAttribute('data-messageId')
    if (!selectedMessageId) return
    const msg = messages.get(Number(selectedMessageId))
    if (!msg) return
    setSelectedMessage(msg)
  }

  const onClickCloseButton = () => {
    setSelectedMessage(initialChatMessage)
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
            selectedMessage={selectedMessage}
            onClickMessage={onClickMessage}
          />
          <ChatMessageForm
            roomId={talk?.id}
            selectedMessage={selectedMessage}
            onClickCloseButton={onClickCloseButton}
          />
        </TabPanel>

        <TabPanel value="1">
          <ChatBox
            messages={messages}
            messageTypes={[ChatMessageMessageTypeEnum.Qa]}
            selectedMessage={selectedMessage}
            onClickMessage={onClickMessage}
          />
          <ChatMessageForm
            roomId={talk?.id}
            selectedMessage={selectedMessage}
            onClickCloseButton={onClickCloseButton}
          />
        </TabPanel>
      </TabContext>
    </div>
  )
}
