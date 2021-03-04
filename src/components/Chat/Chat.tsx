import React, { useEffect, useState } from 'react'
import * as Styled from './styled'
import {
  ChatMessageApi,
  ChatMessageMessageTypeEnum,
  Talk,
  Configuration,
} from '../../client-axios'
import { ChatMessageForm } from './internal/ChatMessageForm'
import ActionCable from 'actioncable'
import dayjs from 'dayjs'
import { ChatMessageClass, ChatMessageMap } from '../../util/chat'
import { TabContext } from '@material-ui/lab'
import { ChatBox } from './internal/ChatBox'
import {
  CreateChatMessageRequest,
  MessageInputs,
} from './internal/ChatMessageRequest'

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
  createdAt: string
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
  const [chatCable, setChatCable] = useState<ActionCable.Cable | null>(null)
  const [checked, setChecked] = useState<boolean>(true)

  // 発表時間の幅を考慮して10分(6000000ミリ秒)余裕をもたせる
  const isArchive = dayjs().unix() - dayjs(talk?.endTime).unix() >= 6000000
  const actionCableUrl = () => {
    if (window.location.protocol == 'http:') {
      return `ws://${window.location.host}/cable`
    } else {
      return `wss://${window.location.host}/cable`
    }
  }
  const fetchChatMessagesFromAPI = async () => {
    const api = new ChatMessageApi(
      new Configuration({ basePath: window.location.origin }),
    )
    const { data } = await api.apiV1ChatMessagesGet(
      'cndo2021',
      String(talk?.id),
      'talk',
    )
    if (typeof data !== 'object') {
      // Chatのwebsocketがエラーを返した場合はログインさせるためにトップページへリダイレクト
      window.location.href = `${window.location.href.replace(/\/ui\//g, '')}`
    }
    if (!messages) setMessages(new ChatMessageMap())
    messages.clear()
    data.forEach((receivedMsg) => {
      messages.addMessage(receivedMsg)
    })
    setMessages(new ChatMessageMap(messages))
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
      receivedMsg.createdAt,
      receivedMsg.body,
      receivedMsg.messageType,
      receivedMsg.replyTo,
    )
    messages.addMessage(msg)
    setMessages(new ChatMessageMap(messages))
  }

  useEffect(() => {
    if (!talk || !messages) return
    if (chatCable) chatCable.disconnect()

    setSelectedMessage(initialChatMessage)
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const actionCable = require('actioncable')
    fetchChatMessagesFromAPI()
    const wsUrl = actionCableUrl()
    const cable = actionCable.createConsumer(wsUrl)
    setChatCable(cable)
    cable.subscriptions.create(
      { channel: 'ChatChannel', roomType: 'talk', roomId: talk.id },
      {
        connected: () => {
          console.log('connected: ' + talk.id)
        },
        disconnected: () => {
          console.log('disconnected: ' + talk.id)
        },
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
  const onTabSelected = (
    _event: React.ChangeEvent<Record<string, never>>,
    newValue: string,
  ) => {
    setSelectedTab(newValue)
  }

  const onClickReplyButton = (e: React.MouseEvent<HTMLInputElement>) => {
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

  const onSendQuestion = (data: MessageInputs) => {
    data.isQuestion = true
    onSendReply(data)
  }

  const onSendReply = (data: MessageInputs) => {
    if (!talk) return
    const api = new ChatMessageApi(
      new Configuration({ basePath: window.location.origin }),
    )
    api.apiV1ChatMessagesPost(
      CreateChatMessageRequest(
        data.chatMessage,
        talk.id,
        data.isQuestion,
        selectedMessage,
      ),
    )
    setSelectedMessage(initialChatMessage)
  }

  const onChecked = (
    _event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean,
  ) => {
    setChecked(checked)
  }

  return (
    <Styled.Outer>
      <Styled.Container>
        <TabContext value={selectedTab}>
          <Styled.TabContainer
            value={selectedTab}
            onChange={onTabSelected}
            textColor="secondary"
            aria-label="simple tabs example"
          >
            <Styled.Tab label="Chat / QA" value="0" {...a11yProps(0)} />
            <Styled.Tab label="QA Only" value="1" {...a11yProps(1)} />
          </Styled.TabContainer>
          <Styled.TabPanel value="0">
            <ChatBox
              talk={talk}
              messages={messages}
              messageTypes={[
                ChatMessageMessageTypeEnum.Chat,
                ChatMessageMessageTypeEnum.Qa,
              ]}
              selectedMessage={selectedMessage}
              checked={checked}
              onClickReplyButton={onClickReplyButton}
              onSendReply={onSendReply}
              onClickCloseButton={onClickCloseButton}
            />
          </Styled.TabPanel>
          <Styled.TabPanel value="1">
            <ChatBox
              talk={talk}
              messages={messages}
              messageTypes={[ChatMessageMessageTypeEnum.Qa]}
              selectedMessage={selectedMessage}
              checked={checked}
              onClickReplyButton={onClickReplyButton}
              onClickCloseButton={onClickCloseButton}
              onSendReply={onSendReply}
            />
          </Styled.TabPanel>
        </TabContext>
        <ChatMessageForm
          isArchive={isArchive}
          selectedMessage={selectedMessage}
          onClickCloseButton={onClickCloseButton}
          onSendMessage={onSendReply}
          onSendQuestion={onSendQuestion}
          onCheck={onChecked}
          checked={checked}
        />
      </Styled.Container>
    </Styled.Outer>
  )
}
