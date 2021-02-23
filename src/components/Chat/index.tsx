export { Chat } from './Chat'
import {
  ChatMessage as ChatMessageInterface,
  ChatMessageMessageTypeEnum,
} from '../../client-axios'

export class ChatMessageMap extends Map<number, ChatMessageClass> {
  addMessage = (msg: ChatMessageClass) => {
    if (!msg.id) return

    if (msg.replyTo) {
      const parent = this.get(msg.replyTo)
      if (parent) {
        if (!parent.children) {
          parent.children = []
        }
        parent.children.push(msg)
      } else {
        this.set(msg.id, msg)
      }
    } else {
      this.set(msg.id, msg)
    }
  }
}

export class ChatMessageClass implements ChatMessageInterface {
  id?: number
  profileId?: number
  speakerId?: number
  eventAbbr: string
  roomId?: number
  roomType?: string
  body: string
  messageType: ChatMessageMessageTypeEnum
  replyTo?: number
  children?: ChatMessageClass[]

  constructor(
    id: number,
    profileId: number,
    speakerId: number,
    eventAbbr: string,
    roomId: number,
    roomType: string,
    body: string,
    messageType: ChatMessageMessageTypeEnum,
    replyTo: number,
  ) {
    this.id = id
    this.profileId = profileId
    this.speakerId = speakerId
    this.eventAbbr = eventAbbr
    this.roomId = roomId
    this.roomType = roomType
    this.body = body
    this.messageType = messageType
    this.replyTo = replyTo
    this.children = []
  }
}
