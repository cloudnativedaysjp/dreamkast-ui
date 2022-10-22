import React, { useEffect, useState } from 'react'
import * as Styled from './styled'
import {
  Event,
  ChatMessageMessageTypeEnum,
  Talk,
  Profile,
} from '../../client-axios'
import { ChatMessageForm } from './internal/ChatMessageForm'
import ActionCable from 'actioncable'
import dayjs from 'dayjs'
import { ChatMessageContainer, ChatMessageMap } from '../../util/chat'
import { TabContext } from '@material-ui/lab'
import { ChatBox } from './internal/ChatBox'
import { MessageInputs } from './internal/ChatMessageRequest'
import {
  useGetApiV1ChatMessagesQuery,
  usePostApiV1ChatMessagesMutation,
} from '../../generated/dreamkast-api.generated'

type Props = {
  event: Event
  profile?: Profile
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

export const Chat: React.FC<Props> = ({ event, profile, talk }) => {
  const initialChatMessage = {
    eventAbbr: event.abbr,
    body: '',
    roomId: !!talk ? talk.id : 0,
    messageType: ChatMessageMessageTypeEnum.Chat,
  }
  const [selectedTab, setSelectedTab] = useState('0')
  const [messages, setMessages] = useState<ChatMessageMap>(
    () => new ChatMessageMap(),
  )
  const [selectedMessage, setSelectedMessage] =
    useState<ChatMessageContainer>(initialChatMessage)
  const [chatCable, setChatCable] = useState<ActionCable.Cable | null>(null)
  const [checked, setChecked] = useState<boolean>(true)
  const [isVisibleForm, setIsVisibleForm] = useState<boolean>(true)

  const { data, isLoading, isError, error } = useGetApiV1ChatMessagesQuery(
    {
      eventAbbr: event.abbr,
      roomId: `${talk?.id}`,
      roomType: 'talk',
    },
    { skip: !talk?.id },
  )
  const [createChatMsg] = usePostApiV1ChatMessagesMutation()

  useEffect(() => {
    if (isLoading) {
      return
    }
    if (isError) {
      // TODO error handling
      console.error(error)
      return
    }
    if (!data) {
      return
    }
    const newMsgs = new ChatMessageMap()
    data.forEach((receivedMsg) => {
      newMsgs.addMessage({ ...receivedMsg }) // copy required since the original one provided by RTK Query is not extensible
    })
    setMessages(newMsgs)
  }, [data, isLoading, isError])

  const actionCableUrl = () => {
    if (window.location.protocol == 'http:') {
      return `ws://${window.location.host}/cable`
    } else {
      return `wss://${window.location.host}/cable`
    }
  }

  const cableReceived = (receivedMsg: ReceivedMsg) => {
    if (!messages) return
    messages.addMessage(receivedMsg)
    setMessages(new ChatMessageMap(messages))
  }

  useEffect(() => {
    if (!talk || !messages) return
    if (chatCable) chatCable.disconnect()

    const endTime = `${talk?.conferenceDayDate} ${dayjs(talk.endTime).format(
      'HH:mm',
    )}`
    // 発表時間の幅を考慮して10分(600秒)余裕をもたせる
    setIsVisibleForm(dayjs().unix() - dayjs(endTime).unix() < 600)

    setSelectedMessage(initialChatMessage)
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const actionCable = require('actioncable')
    const wsUrl = actionCableUrl()
    const cable = actionCable.createConsumer(wsUrl)
    setChatCable(cable)
    cable.subscriptions.create(
      { channel: 'ChatChannel', roomType: 'talk', roomId: talk.id },
      { received: cableReceived },
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
    const chatMessage = {
      eventAbbr: event.abbr,
      roomId: talk.id,
      roomType: 'talk',
      body: data.chatMessage,
      replyTo: selectedMessage?.id || undefined,
      messageType: data.isQuestion
        ? ChatMessageMessageTypeEnum.Qa
        : ChatMessageMessageTypeEnum.Chat,
    }

    createChatMsg({ chatMessage })
      .unwrap()
      .catch((err) => console.error(err))
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
              event={event}
              profile={profile}
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
              event={event}
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
          isVisibleForm={isVisibleForm}
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
