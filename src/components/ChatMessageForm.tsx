import React, {useCallback} from "react";
import {useForm} from "react-hook-form";
import {ChatMessageClass} from "../interfaces";
import {ChatMessageApi} from "../client-axios";

type Props = {}

type Inputs = {
    chatMessage: string,
};

type Reset = (values?: Record<string, any>) => void;

const ChatMessageForm: React.FC<Props> = ({}) => {
    const api = new ChatMessageApi();
    const { register, handleSubmit, reset }: ({
        register: Function,
        handleSubmit: Function,
        reset: Reset,
    }) = useForm<Inputs>();
    const onSubmit = (data: Inputs) => {
        const msg = new ChatMessageClass("cndt2020", 1, data.chatMessage);
        api.apiV1ChatMessagesPost(msg)
    };
    const onReset = useCallback(() => reset(), [reset])

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <label>
                <input type="text" name="chatMessage" ref={register()} />
            </label>
            <input type="submit" onClick={onReset}/>
        </form>
    )
}

export default ChatMessageForm