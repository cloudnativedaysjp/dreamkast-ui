import React from "react";
import * as Styled from "./styled";
import { ChatMessageMessageTypeEnum } from "../../client-axios/api";
import { ChatMessageClass } from "./index";
import ReplyIcon from "@material-ui/icons/Reply";

type Props = {
  chatMessage?: ChatMessageClass;
  selected: boolean;
  onClickMessage: (event: React.MouseEvent<HTMLInputElement>) => void;
};

const ChatMessage: React.FC<Props> = ({
  chatMessage,
  selected,
  onClickMessage,
}) => {
  const isSpeakerMessage = !!chatMessage?.speakerId;

  return (
    <div>
      {selected ? (
        <Styled.ChatSelectedMessage
          isChat={chatMessage?.messageType == ChatMessageMessageTypeEnum.Chat}
        >
          {isSpeakerMessage ? "[S] " : ""}
          {chatMessage?.body}
        </Styled.ChatSelectedMessage>
      ) : (
        <Styled.ChatMessage
          isChat={chatMessage?.messageType == ChatMessageMessageTypeEnum.Chat}
        >
          {isSpeakerMessage ? "[S] " : ""}
          {chatMessage?.body}
          <Styled.ReplyButton
            data-messageId={chatMessage?.id}
            onClick={onClickMessage}
          >
            <ReplyIcon fontSize="small" />
          </Styled.ReplyButton>
        </Styled.ChatMessage>
      )}
      {chatMessage?.children?.map((msg) => {
        return (
          <Styled.ChatReplyMessage
            isChat={msg.messageType == ChatMessageMessageTypeEnum.Chat}
          >
            {isSpeakerMessage ? "[S] " : ""}
            {msg.body}
          </Styled.ChatReplyMessage>
        );
      })}
    </div>
  );
};

export default ChatMessage;
