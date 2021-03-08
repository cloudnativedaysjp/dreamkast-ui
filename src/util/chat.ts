import {
  ChatMessage as ChatMessageInterface,
  ChatMessageMessageTypeEnum,
} from '../client-axios'

export class ChatMessageMap extends Map<number, ChatMessageClass> {
  addMessage = (msg: ChatMessageClass): void => {
    if (!msg.id) return

    if (msg.replyTo) {
      const parent = this.get(msg.replyTo)
      if (parent) {
        if (!parent.children) {
          parent.children = new Map<number, ChatMessageClass>()
        }
        parent.children.set(msg.id, msg)
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
  createdAt?: string
  body: string
  messageType: ChatMessageMessageTypeEnum
  replyTo?: number
  children?: Map<number, ChatMessageClass>

  constructor(
    id: number,
    profileId: number,
    speakerId: number,
    eventAbbr: string,
    roomId: number,
    roomType: string,
    createdAt: string,
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
    this.createdAt = createdAt
    this.body = body
    this.messageType = messageType
    this.replyTo = replyTo
    this.children = new Map<number, ChatMessageClass>()
  }
}
