import { Talk } from '../../generated/dreamkast-api.generated'
import { isStorageAvailable } from './index'

export function getSlotId(talk: Talk): number {
  if (talk.dayId == null || talk.slotNum == null) {
    return 0
  }
  return talk.dayId * 100 + talk.slotNum
}

export function getSessionEventNum(slotId: number) {
  return 100000 + slotId
}

export function getChatEventNum(slotId: number) {
  return 110000 + slotId
}

export function getAllStampCompEventNum() {
  return 120001
}

export function makeTrackResolveMap(genFn: (eventNum: number) => string) {
  const trackId = [0, 1, 2, 3, 4, 5]
  return trackId.reduce((accum, curr) => {
    const eventNum = 130001 + curr
    accum[genFn(eventNum)] = curr
    return accum
  }, {} as Record<string, number>)
}

const keyGotChatPoint = 'gotChatPoint'
const keyAllStampCollected = 'allStampCollected'
const keyPointEventId = 'pointEventId'
const keySessionPointEventId = 'sessionPointEventId'

export const setGotChatPoint = (slotId: number) => {
  if (isStorageAvailable('sessionStorage')) {
    sessionStorage.setItem(`${keyGotChatPoint}${slotId}`, 'y')
  }
}

export const getGotChatPoint = (slotId: number): boolean => {
  if (isStorageAvailable('sessionStorage')) {
    return !!sessionStorage.getItem(`${keyGotChatPoint}${slotId}`)
  }
  return false
}

export const setAllStampCollected = () => {
  if (isStorageAvailable('sessionStorage')) {
    sessionStorage.setItem(keyAllStampCollected, 'y')
  }
}

export const getAllStampCollected = (): boolean => {
  if (isStorageAvailable('sessionStorage')) {
    return !!sessionStorage.getItem(keyAllStampCollected)
  }
  return false
}

export const setPointEventId = (key: string) => {
  if (isStorageAvailable('sessionStorage')) {
    sessionStorage.setItem(keyPointEventId, key)
  }
}

export const clearPointEventId = () => {
  if (isStorageAvailable('sessionStorage')) {
    sessionStorage.removeItem(keyPointEventId)
  }
}

export const getPointEventId = (): string | null => {
  if (isStorageAvailable('sessionStorage')) {
    return sessionStorage.getItem(keyPointEventId)
  }
  return null
}

export const setSessionPointEventId = (key: string) => {
  if (isStorageAvailable('sessionStorage')) {
    sessionStorage.setItem(keySessionPointEventId, key)
  }
}

export const clearSessionPointEventId = () => {
  if (isStorageAvailable('sessionStorage')) {
    sessionStorage.removeItem(keySessionPointEventId)
  }
}

export const getSessionPointEventId = (): string | null => {
  if (isStorageAvailable('sessionStorage')) {
    return sessionStorage.getItem(keySessionPointEventId)
  }
  return null
}
