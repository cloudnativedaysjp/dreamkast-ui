import React, { useEffect } from 'react'
import { Box, Grid } from '@material-ui/core'
import { Talk } from '../interfaces'
import { useState } from 'react'
import {
  ChatMessage as ChatMessageInterface,
  ChatMessageApi,
} from '../client-axios/api'
import { makeStyles } from '@material-ui/core/styles'
import ChatMessage from './ChatMessage'
import { ChatMessageClass } from '../interfaces'
import ChatMessageForm from './ChatMessageForm'
import ActionCable from 'actioncable'

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

const Chat: React.FC<Props> = ({ talk }) => {
  const api = new ChatMessageApi()
  const classes = useStyles()
  const [messages, setMessages] = useState<ChatMessageInterface[]>([])
  const fetchChatMessagesFromAPI = () => {
    if (!talk) return
    api.apiV1ChatMessagesGet('cndo2021', talk.id, 'talk').then((res) => {
      setMessages(res.data)
    })
  }

  useEffect(() => {
    if (!talk) return
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const actionCable = require('actioncable')

    setMessages([])
    fetchChatMessagesFromAPI()
    const cableApp: ActionCable.Cable = actionCable.createConsumer(
      'ws://localhost:8080/cable',
    )
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

export default Chat
