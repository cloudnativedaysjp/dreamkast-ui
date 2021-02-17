import React, {useCallback} from "react";
import {useForm} from "react-hook-form";
import {ChatMessageApi} from "../client-axios";

type Props = {}

type Inputs = {
    chatMessage: string,
};

const ChatMessageForm: React.FC<Props> = ({}) => {
    const api = new ChatMessageApi();
    const { register, handleSubmit, reset } = useForm<Inputs>();

    const onSubmit = (data: Inputs) => {
        console.log(data);
        const msg = {eventAbbr: "cndo2021", roomId: 1, roomType: "talk", body: data.chatMessage}
        api.apiV1ChatMessagesPost(msg)
    };
    const onReset = useCallback(() => reset({ chatMessage: "" }), [reset])

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <input name="chatMessage" ref={register} />
            <input type="submit" onClick={onReset}/>
        </form>
    )
}

export default ChatMessageForm
