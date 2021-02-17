// You can include shared interfaces/types in a separate file
// and then use them in any component by importing them. For
// example, to import the interface below do:
//
// import { User } from 'path/to/interfaces';

import {ChatMessage as ChatMessageInterface} from "../client-axios";

export type Talk = {
  id: string
  trackId: string
  vimeoId: string
  title: string
  description: string
  speakers: string[]
  onAir?: boolean
}

export type Track = {
  [key: string]: string
}

export class ChatMessageClass implements ChatMessageInterface {
  id?: number
  eventAbbr: string;
  roomId?: number;
  roomType?: string
  body: string;

  constructor(eventAbbr: string, roomId: number, roomType: string, body: string) {
    this.eventAbbr = eventAbbr;
    this.roomId = roomId;
    this.roomType = roomType;
    this.body = body;
  }

  createFromWebSocket(id: number, eventAbbr: string, roomId: number, roomType: string, body: string) {
    this.id = id
    this.eventAbbr = eventAbbr;
    this.roomId = roomId;
    this.roomType = roomType;
    this.body = body;
  }
}
