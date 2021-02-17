import React, {useCallback} from "react";
import {useForm} from "react-hook-form";
import {ChatMessageApi} from "../client-axios";
import {TextField} from "@material-ui/core";

type Props = {}

type Inputs = {
    chatMessage: string,
};

type Reset = (values?: Record<string, any>) => void;

const ChatMessageForm: React.FC<Props> = ({}) => {
    const api = new ChatMessageApi();
    const { register, handleSubmit, reset } = useForm<Inputs>();

    const onSubmit = (data: Inputs) => {
        console.log(data);
        const msg = {eventAbbr: "cndo2021", roomId: 1, roomType: "talk", body: data.chatMessage}
        console.log(msg)
        reset()
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
