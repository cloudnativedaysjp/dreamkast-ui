export { Chat } from './Chat'
import { ChatMessage as ChatMessageInterface, ChatMessageMessageTypeEnum } from '../../client-axios'


export class ChatMessageClass implements ChatMessageInterface {
  id?: number;
  profileId? :number;
  speakerId?: number;
  eventAbbr: string;
  roomId?: number;
  roomType?: string;
  body: string;
  messageType: ChatMessageMessageTypeEnum;

  constructor(id: number, profileId: number, speakerId: number, eventAbbr: string, roomId: number, roomType: string, body: string, messageType: ChatMessageMessageTypeEnum) {
    this.id = id;
    this.profileId = profileId;
    this.speakerId = speakerId;
    this.eventAbbr = eventAbbr;
    this.roomId = roomId;
    this.roomType = roomType;
    this.body = body;
    this.messageType = messageType
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
