import { useSelector } from 'react-redux'
import { settingsSelector } from '../../store/settings'

export const useMenuContents = (eventAbbr: string | undefined) => {
  const settings = useSelector(settingsSelector)
  const guideUrl = (): string => {
    if (settings.profile.isAttendOffline) {
      return `https://sites.google.com/view/${eventAbbr}/現地参加オフライン`
    } else {
      return `https://sites.google.com/view/${eventAbbr}/オンライン参加`
    }
  }
  const isPreEvent = settings.conferenceDay?.internal

  return {
    guideUrl,
    isPreEvent,
  }
}
