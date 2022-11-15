import { Talk } from '../generated/dreamkast-api.generated'
import { createHash } from 'crypto'

export function getSlotId(talk: Talk): number {
  if (talk.dayId == null || talk.slotNum == null) {
    return 0
  }
  return talk.dayId * 100 + talk.slotNum
}

export function getPointEventIdBySlot(salt: string, slotId: number): string {
  return getPointEventId(salt, 100000 + slotId)
}

export function getPointEventId(salt: string, eventNum: number): string {
  const shasum = createHash('sha1')
  return shasum.update(`${salt}/${eventNum}`).digest('hex')
}

export function makeTrackResolveMap(eventAbbr: string) {
  const trackId = [0, 1, 2, 3, 4, 5]
  return trackId.reduce((accum, curr) => {
    const eventNum = 130001 + curr
    accum[getPointEventId(eventAbbr, eventNum)] = curr
    return accum
  }, {} as Record<string, number>)
}
