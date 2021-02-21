import React from 'react'
import { Box} from '@material-ui/core'
import { ChatMessage as ChatMessageInterface, ChatMessageMessageTypeEnum } from '../../client-axios'
import {makeStyles} from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import ChatMessage from "./ChatMessage";

type Props = {
  messages: ChatMessageInterface[]
  messageTypes: ChatMessageMessageTypeEnum[]
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

export const ChatBox: React.FC<Props> = ({ messages, messageTypes }) => {
  const classes = useStyles()
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
    <Box component="div" overflow="scroll" className={classes.box}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          {messages.map((chatMessage) => {
            if (messageTypes.includes(chatMessage.messageType)) {
              return (
                <ChatMessage
                  chatMessage={chatMessage}
                  setRef={setLastMessageElement}
                />
              )
            }
          })}
        </Grid>
      </Grid>
    </Box>
  )
}
