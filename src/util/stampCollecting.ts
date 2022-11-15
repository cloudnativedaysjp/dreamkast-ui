import { Talk } from '../generated/dreamkast-api.generated'
import { createHash } from 'crypto'
import { isStorageAvailable } from './sessionstorage'

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

type StampResult = 'ok' | 'skipped' | 'invalid' | 'error'
const keyQRCodeStampResult = 'qrCodeStampResult'

export const setQRCodeStampResult = (res: StampResult) => {
  if (isStorageAvailable('sessionStorage')) {
    sessionStorage.setItem(keyQRCodeStampResult, res)
  }
}

export const resetQRCodeStampResult = () => {
  if (isStorageAvailable('sessionStorage')) {
    sessionStorage.removeItem(keyQRCodeStampResult)
  }
}

export const getQRCodeStampResult = (): StampResult | null => {
  if (isStorageAvailable('sessionStorage')) {
    const res = sessionStorage.getItem(keyQRCodeStampResult)
    if (res === 'ok' || res === 'skipped' || res === 'invalid' || res == null) {
      return res
    }
  }
  return 'error'
}
