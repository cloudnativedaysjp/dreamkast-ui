// You can include shared interfaces/types in a separate file
// and then use them in any component by importing them. For
// example, to import the interface below do:
//
// import { User } from 'path/to/interfaces';

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
  id: number
  name: string
  videoPlatform: string
  videoId: string
}

export type Event = {
  id: number
  name: string
  abbr: string
  status: string
  theme: string
  about: string
  privacy_policy: string
  privacy_policy_for_speaker: string
  copyright: string
  coc: string
}
