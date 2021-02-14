// You can include shared interfaces/types in a separate file
// and then use them in any component by importing them. For
// example, to import the interface below do:
//
// import { User } from 'path/to/interfaces';

import {ChatMessage as ChatMessageInterface} from "../client-axios";

export type Talk = {
  id: number
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
  eventAbbr: string;
  talkId: number;
  body: string;

  constructor(eventAbbr: string, talkId: number, body: string) {
    this.eventAbbr = eventAbbr;
    this.talkId = talkId;
    this.body = body;
  }
}
