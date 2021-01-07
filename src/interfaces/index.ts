// You can include shared interfaces/types in a separate file
// and then use them in any component by importing them. For
// example, to import the interface below do:
//
// import { User } from 'path/to/interfaces';

export type Talk = {
  id: Number
  trackId: string
  vimeoId: string
  title: string
  description: string
  speakers: string[]
  onAir?: Boolean
}
