
import React, {useEffect} from 'react'
import {Box, Grid} from '@material-ui/core'
import { Talk } from '../interfaces'
import { useState } from 'react'
import { ChatMessage as ChatMessageInterface } from '../client-axios/api'
import { makeStyles } from "@material-ui/core/styles";
import ChatMessage from './ChatMessage';
import {ChatMessageClass} from "../interfaces";
import ChatMessageForm from "./ChatMessageForm";

if (typeof window !== "undefined") {
    var actionCable = require("actioncable");
}

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
    const [messages, setMessages] = useState<ChatMessageInterface[]>([])

    useEffect(() => {
        const cable = actionCable.createConsumer('ws://localhost:8080/cable');
        cable.subscriptions.create({channel: 'ChatChannel'},
            {
                received(obj: any) {
                    const msg = new ChatMessageClass(obj["eventAbbr"], obj["roomId"], obj["roomType"], obj["body"]);
                    setMessages(messages => messages.concat(msg));
                }
            }
        )
    }, []);

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
            <ChatMessageForm roomId={talk.id} />
        </div>
    )
}

export default Chat
