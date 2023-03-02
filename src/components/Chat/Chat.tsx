import React, { useContext, useEffect, useMemo, useState } from 'react'
import * as Styled from './styled'
import { ChatMessageForm } from './internal/ChatMessageForm'
import dayjs from 'dayjs'
import { ChatMessageContainer, ChatMessageMap } from '../../util/chat'
import { TabContext } from '@material-ui/lab'
import { ChatBox } from './internal/ChatBox'
import { MessageInputs } from './internal/ChatMessageRequest'
import {
  ChatMessageProperties,
  dreamkastApi,
  Event,
  GetApiV1ChatMessagesApiArg,
  GetApiV1ChatMessagesApiResponse,
  Talk,
  usePostApiV1ChatMessagesMutation,
  usePostApiV1ProfileByProfileIdPointMutation,
} from '../../generated/dreamkast-api.generated'
import {
  getChatEventNum,
  getGotChatPoint,
  getSlotId,
  setGotChatPoint,
} from '../../util/sessionstorage/trailMap'
import { settingsSelector } from '../../store/settings'
import { useSelector } from 'react-redux'
import { EnvCtx } from '../../context/env'
import { RootState } from '../../store'

type Props = {
  event: Event
  talk?: Talk
}

type MessageType = Exclude<ChatMessageProperties['messageType'], undefined>

type ReceivedMsg = {
  id: number
  profileId: number
  speakerId: number
  eventAbbr: string
  roomId: number
  roomType: string
  createdAt: string
  body: string
  messageType: MessageType
  replyTo: number
}

const { useGetApiV1ChatMessagesQuery } = dreamkastApi.injectEndpoints({
  endpoints: (build) => ({
    // NOTE: copied and overrided the generated one to add custom onCacheEntryAdded for websocket support.
    getApiV1ChatMessages: build.query<
      GetApiV1ChatMessagesApiResponse,
      GetApiV1ChatMessagesApiArg
    >({
      query: (queryArg) => ({
        url: `/api/v1/chat_messages`,
        params: {
          eventAbbr: queryArg.eventAbbr,
          roomId: queryArg.roomId,
          roomType: queryArg.roomType,
          createdFrom: queryArg.createdFrom,
        },
      }),
      async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved, getState },
      ) {
        // create a websocket connection when the cache subscription starts
        await cacheDataLoaded
        const { wsBaseUrl } = (getState() as RootState).auth
        const wsUrl = new URL('/cable', wsBaseUrl).toString()

        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const actionCable = require('actioncable') // cannot import actioncable at the top of module since it depends on window
        const cable = actionCable.createConsumer(wsUrl)
        cable.subscriptions.create(
          { channel: 'ChatChannel', roomType: 'talk', roomId: arg.roomId },
          {
            received: (msg: ReceivedMsg) => {
              updateCachedData((draft) => {
                draft.push(msg)
              })
            },
          },
        )

        // cacheEntryRemoved will resolve when the cache subscription is no longer active
        await cacheEntryRemoved

        // perform cleanup steps once the `cacheEntryRemoved` promise resolves
        cable.disconnect()
      },
      providesTags: ['ChatMessage'],
    }),
  }),
  overrideExisting: true,
})

export const Chat: React.FC<Props> = ({ event, talk }) => {
  const initialChatMessage = {
    eventAbbr: event.abbr,
    body: '',
    roomId: !!talk ? talk.id : 0,
    messageType: 'chat' as MessageType,
  }
  const [selectedTab, setSelectedTab] = useState('0')
  const [messages, setMessages] = useState<ChatMessageMap>(
    () => new ChatMessageMap(),
  )
  const [selectedMessage, setSelectedMessage] =
    useState<ChatMessageContainer>(initialChatMessage)
  const [checked, setChecked] = useState<boolean>(true)
  const [isVisibleForm, setIsVisibleForm] = useState<boolean>(true)
  const envCtx = useContext(EnvCtx)
  const settings = useSelector(settingsSelector)

  const { data, isLoading, isError, error } = useGetApiV1ChatMessagesQuery(
    {
      eventAbbr: event.abbr,
      roomId: `${talk?.id}`,
      roomType: 'talk',
    },
    { skip: !talk?.id },
  )
  const [createChatMsg] = usePostApiV1ChatMessagesMutation()
  const [postPointEvent] = usePostApiV1ProfileByProfileIdPointMutation()

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

  useEffect(() => {
    if (!talk || !messages) return

    const endTime = `${talk?.conferenceDayDate} ${dayjs(talk.endTime).format(
      'HH:mm',
    )}`
    // 発表時間の幅を考慮して10分(600秒)余裕をもたせる
    setIsVisibleForm(dayjs().unix() - dayjs(endTime).unix() < 600)
    setSelectedMessage(initialChatMessage)
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

  const slotId = useMemo(() => {
    if (!talk) {
      return null
    }
    return getSlotId(talk)
  }, [talk])
  const chatPointEventId = useMemo(() => {
    if (!slotId) {
      return null
    }
    const eventNum = getChatEventNum(slotId)
    return envCtx.getPointEventId(eventNum)
  }, [slotId, envCtx])
  const isAlreadyGotChatPoint = !!slotId && getGotChatPoint(slotId)

  const onSendReply = (data: MessageInputs) => {
    if (!talk) return
    const chatMessage = {
      eventAbbr: event.abbr,
      roomId: talk.id,
      roomType: 'talk',
      body: data.chatMessage,
      replyTo: selectedMessage?.id || undefined,
      messageType: (data.isQuestion ? 'qa' : 'chat') as MessageType,
    }

    ;(async () => {
      try {
        await createChatMsg({ chatMessage }).unwrap()
        setSelectedMessage(initialChatMessage)

        if (!slotId || !chatPointEventId) {
          return
        }
        if (isAlreadyGotChatPoint) {
          return
        }
        await postPointEvent({
          profileId: `${settings.profile.id}`,
          profilePoint: {
            conference: settings.eventAbbr,
            pointEventId: chatPointEventId,
          },
        }).unwrap()
        setGotChatPoint(slotId)
      } catch (err) {
        console.error(err)
      }
    })()
  }

  const onChecked = (
    _event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean,
  ) => {
    setChecked(checked)
  }

  return (
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
            talk={talk}
            messages={messages}
            messageTypes={['chat', 'qa']}
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
            messageTypes={['qa']}
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
  )
}
