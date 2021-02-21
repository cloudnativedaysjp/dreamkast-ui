import React, { useEffect, useRef } from 'react'
import { Paper } from '@material-ui/core'
import { ChatMessage as ChatMessageObject, ChatMessageMessageTypeEnum } from '../../client-axios/api'
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
    chat: {
        padding: theme.spacing(2),
        background: '#ffffff',
        whiteSpace: 'pre-wrap',
    },
    qa: {
        padding: theme.spacing(2),
        background: '#f5f5f5',
        whiteSpace: 'pre-wrap',
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
            <Paper className={chatMessage.messageType == ChatMessageMessageTypeEnum.Chat ? classes.chat : classes.qa}>{isSpeakerMessage() ? "[S] " : ""}{chatMessage.body}</Paper>
        </div>
    )
}

export default ChatMessage
