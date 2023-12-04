import { useSelector } from 'react-redux'
import { settingsSelector } from '../../store/settings'

export const useMenuContents = () => {
  const settings = useSelector(settingsSelector)
  const guideUrl = (): string => {
    if (settings.profile.isAttendOffline) {
      return `https://cloudnativedays.notion.site/CNDT2023-419425c3fbec44ce9f35779c6844f315?pvs=4`
    } else {
      return `https://cloudnativedays.notion.site/CNDT2023-00af5ea63e624ebc9c2cd1da2e3e2e6e?pvs=4`
    }
  }
  const isPreEvent = settings.conferenceDay?.internal

  return {
    guideUrl,
    isPreEvent,
  }
}
