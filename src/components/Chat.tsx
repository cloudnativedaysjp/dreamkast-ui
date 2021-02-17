
import React, {useEffect} from 'react'
import {Box, Grid} from '@material-ui/core'
import { Talk } from '../interfaces'
import { useState } from 'react'
import {ChatMessage as ChatMessageInterface, ChatMessageApi} from '../client-axios/api'
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

const CableApp = {};
const Chat: React.FC<Props> = ({ talk }) => {
    const api = new ChatMessageApi();
    const classes = useStyles();
    const [messages, setMessages] = useState<ChatMessageInterface[]>([])
    const fetchChatMessagesFromAPI = () => {
        api.apiV1ChatMessagesGet("cndo2021", talk.id, "talk")
            .then(res => {
                setMessages(res.data);
            });
    }

    useEffect(() => {
        fetchChatMessagesFromAPI();
    }, []);


    useEffect(() => {
        setMessages([]);
        if (CableApp.cable != null) {
            CableApp.cable.disconnect();
        }
        fetchChatMessagesFromAPI();
        CableApp.cable = actionCable.createConsumer('ws://localhost:8080/cable');
        CableApp.cable.subscriptions.create({channel: 'ChatChannel', roomType: 'talk', roomId: talk.id},
            {
                received(obj: any) {
                    const id = obj["id"]
                    if (messages && messages[id]) {
                        const msg = new ChatMessageClass(obj["eventAbbr"], obj["roomId"], obj["roomType"], obj["body"]);
                        messages[id] = msg
                        setMessages(messages => messages);
                    }
                }
            }
        )
    }, [talk])

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
