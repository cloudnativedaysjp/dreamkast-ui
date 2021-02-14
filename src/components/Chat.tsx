
import React, {useEffect} from 'react'
import {Box, Grid} from '@material-ui/core'
import { Talk } from '../interfaces'
import { useState } from 'react'
import { ChatMessage as ChatMessageInterface, ChatMessageApi } from '../client-axios/api'
import useInterval from "use-interval";
import { makeStyles } from "@material-ui/core/styles";
import ChatMessage from './ChatMessage';
import ChatMessageForm from './ChatMessageForm';

type Props = {
    talk: Talk
}

const useStyles = makeStyles((theme) => ({
    box: {
        height: '400px',
    },
    paper: {
        padding: theme.spacing(2),
        color: theme.palette.text.secondary,
    },
}));

const Chat: React.FC<Props> = ({ talk }) => {
    const classes = useStyles();
    const api = new ChatMessageApi();
    const [messages, setMessages] = useState<ChatMessageInterface[]>([])

    useEffect(() => {
        api.apiV1ChatMessagesGet("cndt2020", "1", "talk")
            .then(res => {
                setMessages(res.data);
            });
    }, []);

    useInterval(() => {
        api.apiV1ChatMessagesGet("cndt2020", "1", "talk")
            .then(res => {
                setMessages(res.data);
            });
    }, 10000);

    const setLastMessageElement = (chatMessage: ChatMessageInterface, ref: React.RefObject<HTMLDivElement>) => {
        const lastChat = messages[messages.length - 1];
        if (chatMessage.id === lastChat.id) {
            ref && ref.current && ref.current.scrollIntoView();
        }
    };

    return (
        <div>
            <h2>Chat / QA</h2>
            <h3>{talk.title}</h3>
            <Box component="div" overflow="scroll" className={classes.box}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        {
                            messages.map((chatMessage) => {
                                return <ChatMessage chatMessage={chatMessage} setRef={setLastMessageElement} />
                            })
                        }
                    </Grid>
                </Grid>
            </Box>
            <ChatMessageForm />
        </div>
    )
}

export default Chat
