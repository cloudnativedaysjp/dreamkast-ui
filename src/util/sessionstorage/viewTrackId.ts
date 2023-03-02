import { isStorageAvailable } from './index'

export const setViewTrackIdToSessionStorage = (viewTrackId: number) => {
  if (isStorageAvailable('sessionStorage')) {
    sessionStorage.setItem('view_track_id', String(viewTrackId))
  }
}

export const getViewTrackIdFromSessionStorage = (): number | null => {
  if (isStorageAvailable('sessionStorage')) {
    const viewTrackId = sessionStorage.getItem('view_track_id')
    if (viewTrackId) {
      return Number(viewTrackId)
    }
  }
  return null
}
