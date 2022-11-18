import { Talk } from '../generated/dreamkast-api.generated'
import { isStorageAvailable } from './sessionstorage'

export function getSlotId(talk: Talk): number {
  if (talk.dayId == null || talk.slotNum == null) {
    return 0
  }
  return talk.dayId * 100 + talk.slotNum
}

export function getSessionEventNum(slotId: number) {
  return 100000 + slotId
}

export function makeTrackResolveMap(genFn: (eventNum: number) => string) {
  const trackId = [0, 1, 2, 3, 4, 5]
  return trackId.reduce((accum, curr) => {
    const eventNum = 130001 + curr
    accum[genFn(eventNum)] = curr
    return accum
  }, {} as Record<string, number>)
}

export type QRCodeRequestResult = 'ok' | 'skipped' | 'invalid' | 'error'
const keyQRCodeStampResult = 'qrCodeStampResult'
const keyTrailMapOpenNext = 'trailMapOpenNext'

export const setQRCodeStampResult = (res: QRCodeRequestResult) => {
  if (isStorageAvailable('sessionStorage')) {
    sessionStorage.setItem(keyQRCodeStampResult, res)
  }
}

export const clearQRCodeStampResult = () => {
  if (isStorageAvailable('sessionStorage')) {
    sessionStorage.removeItem(keyQRCodeStampResult)
  }
}

export const getQRCodeStampResult = (): QRCodeRequestResult | null => {
  if (isStorageAvailable('sessionStorage')) {
    const res = sessionStorage.getItem(keyQRCodeStampResult)
    if (res === 'ok' || res === 'skipped' || res === 'invalid' || res == null) {
      return res
    }
  }
  return 'error'
}

export const setTrailMapOpenNext = () => {
  if (isStorageAvailable('sessionStorage')) {
    sessionStorage.setItem(keyTrailMapOpenNext, 'y')
  }
}

export const clearTrailMapOpenNext = () => {
  if (isStorageAvailable('sessionStorage')) {
    sessionStorage.removeItem(keyTrailMapOpenNext)
  }
}

export const getTrailMapOpenNext = (): boolean => {
  if (isStorageAvailable('sessionStorage')) {
    return !!sessionStorage.getItem(keyTrailMapOpenNext)
  }
  return false
}