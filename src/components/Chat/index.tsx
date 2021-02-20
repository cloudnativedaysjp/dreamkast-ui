export { Chat } from './Chat'
import { ChatMessage as ChatMessageInterface } from '../../client-axios'

export class ChatMessageClass implements ChatMessageInterface {
  id?: number
  eventAbbr: string
  roomId?: number
  roomType?: string
  body: string

  constructor(
    eventAbbr: string,
    roomId: number,
    roomType: string,
    body: string,
  ) {
    this.eventAbbr = eventAbbr
    this.roomId = roomId
    this.roomType = roomType
    this.body = body
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  createFromWebSocket(
    id: number,
    eventAbbr: string,
    roomId: number,
    roomType: string,
    body: string,
  ) {
    this.id = id
    this.eventAbbr = eventAbbr
    this.roomId = roomId
    this.roomType = roomType
    this.body = body
  }
}
