import React, {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {ChatMessageApi} from "../client-axios";

type Props = {
    roomId: string
}

type Inputs = {
    chatMessage: string,
};

const ChatMessageForm: React.FC<Props> = ({roomId}) => {
    const api = new ChatMessageApi();
    const {
        register,
        handleSubmit,
        reset,
        formState: { isSubmitSuccessful }
    } = useForm<Inputs>();
    const [submittedData, setSubmittedData] = useState({});

    const onSubmit = (data: Inputs) => {
        setSubmittedData(data);
        const msg = {eventAbbr: "cndo2021", roomId: roomId, roomType: "talk", body: data.chatMessage}
        api.apiV1ChatMessagesPost(msg)
    };
    useEffect(() => {
        if (isSubmitSuccessful) {
            reset({ chatMessage: "" })
        }
    }, [isSubmitSuccessful, submittedData, reset]);


    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <input name="chatMessage" ref={register} />
            <input type="submit" />
        </form>
    )
}

export default ChatMessageForm
