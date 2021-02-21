import React, { useEffect, useRef } from 'react'
import { Paper } from '@material-ui/core'
import { ChatMessage as ChatMessageObject } from '../../client-axios/api'
import { makeStyles } from '@material-ui/core/styles'

type Props = {
    chatMessage: ChatMessageObject
    setRef: (
        chatMessage: ChatMessageObject,
        ref: React.RefObject<HTMLDivElement>,
    ) => void
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

const ChatMessage: React.FC<Props> = ({ chatMessage, setRef }) => {
    const ref = useRef<HTMLDivElement>(null)
    const classes = useStyles()
    const isSpeakerMessage = () => {
        if (chatMessage.speaker_id) {
            return true
        } else {
            return false
        }
    }

    useEffect(() => {
        setRef(chatMessage, ref)
    }, [setRef, chatMessage, ref])

    return (
        <div ref={ref}>
            <Paper className={classes.paper}>{isSpeakerMessage() ? "[S] " : ""}{chatMessage.body}</Paper>
        </div>
    )
}

export default ChatMessage
