import React, { useEffect, useState } from 'react'
import { Box } from '@material-ui/core'
import {
  ChatMessage as ChatMessageInterface,
  ChatMessageApi,
  Talk,
  Configuration,
} from '../../client-axios'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import ChatMessageForm from './ChatMessageForm'
import ChatMessage from './ChatMessage'
import ActionCable from 'actioncable'
import { ChatMessageClass } from './index'

type Props = {
  talk?: Talk
}
const useStyles = makeStyles((theme) => ({
  box: {
    height: '400px',
  },
  paper: {
    padding: theme.spacing(2),
    color: theme.palette.text.secondary,
  },
}))

export const Chat: React.FC<Props> = ({ talk }) => {
  const classes = useStyles()
  const [messages, setMessages] = useState<ChatMessageInterface[]>([])
  const fetchChatMessagesFromAPI = (api: ChatMessageApi) => {
    if (!talk) return
    api
      .apiV1ChatMessagesGet('cndo2021', String(talk.id), 'talk')
      .then((res) => {
        setMessages(res.data)
      })
  }

  useEffect(() => {
    const api = new ChatMessageApi(new Configuration({basePath: window.location.origin}))

    if (!talk) return
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const actionCable = require('actioncable')

    setMessages([])
    fetchChatMessagesFromAPI(api)
    let wsUrl = ""
    if(window.location.protocol == "http:"){
      wsUrl = `ws://${window.location.host}/cable`
    }else{
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
          eventAbbr: string
          roomId: number
          roomType: string
          body: string
        }) {
          const msg = new ChatMessageClass(
            receivedMsg.eventAbbr,
            receivedMsg.roomId,
            receivedMsg.roomType,
            receivedMsg.body,
          )
          setMessages((messages) => messages.concat(msg))
        },
      },
    )
  }, [talk])

  const setLastMessageElement = (
    chatMessage: ChatMessageInterface,
    ref: React.RefObject<HTMLDivElement>,
  ) => {
    const lastChat = messages[messages.length - 1]
    if (chatMessage.id === lastChat.id) {
      ref && ref.current && ref.current.scrollIntoView()
    }
  }

  return (
    <div>
      <h2>Chat / QA</h2>
      <h3>{talk?.title}</h3>
      <Box component="div" overflow="scroll" className={classes.box}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            {messages.map((chatMessage) => {
              return (
                <ChatMessage
                  chatMessage={chatMessage}
                  setRef={setLastMessageElement}
                />
              )
            })}
          </Grid>
        </Grid>
      </Box>
      <ChatMessageForm roomId={talk?.id} />
    </div>
  )
}
