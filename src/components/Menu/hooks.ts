import { useSelector } from 'react-redux'
import { settingsSelector } from '../../store/settings'

export const useMenuContents = () => {
  const settings = useSelector(settingsSelector)
  const guideUrl = (): string => {
    if (settings.profile.isAttendOffline) {
      return `https://pfem.notion.site/35421b0141e0801d9016d6ed0e5a138f`
    } else {
      return `https://pfem.notion.site/35421b0141e0801d9016d6ed0e5a138f`
    }
  }
  const isPreEvent = settings.conferenceDay?.internal

  return {
    guideUrl,
    isPreEvent,
  }
}
