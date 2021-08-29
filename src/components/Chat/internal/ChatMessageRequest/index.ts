import { ChatMessageMessageTypeEnum } from '../../../../client-axios'
import { ChatMessageClass } from '../../../../util/chat'

export type MessageInputs = {
  chatMessage: string
  isQuestion: boolean
}

type ChatMessageRequestClass = {
  eventAbbr: string
  roomId: number
  roomType: string
  body: string
  messageType: ChatMessageMessageTypeEnum
  replyTo: number | undefined
}

export const ChatMessageRequest = (
  eventAbbr: string,
  roomId: number,
  roomType: string,
  body: string,
  replyTo: number | undefined,
): ChatMessageRequestClass => {
  return {
    eventAbbr: eventAbbr,
    roomId: roomId,
    roomType: roomType,
    body: body,
    messageType: ChatMessageMessageTypeEnum.Chat,
    replyTo: replyTo,
  }
}

export const CreateChatMessageRequest = (
  chatMessage: string,
  roomId: number,
  isQuestion: boolean,
  selectedMessage?: ChatMessageClass,
): ChatMessageRequestClass => {
  const req = ChatMessageRequest(
    'cicd2021',
    roomId,
    'talk',
    chatMessage,
    undefined,
  )
  if (selectedMessage && selectedMessage.id) {
    req.replyTo = selectedMessage.id
  }
  if (isQuestion) {
    req.messageType = ChatMessageMessageTypeEnum.Qa
  }
  return req
}
