import { useSelector } from 'react-redux'
import { settingsSelector } from '../../store/settings'

export const useMenuContents = () => {
  const settings = useSelector(settingsSelector)
  const guideUrl = (): string => {
    if (settings.profile.isAttendOffline) {
      return `https://cloudnativedays.notion.site/CNDF2023-8919cee8a3bc433eb9844a331a9f6644?pvs=4`
    } else {
      return `https://cloudnativedays.notion.site/CNDF2023-6d87b3e4773e46e1bdda055e6b7f2a8d?pvs=4`
    }
  }
  const isPreEvent = settings.conferenceDay?.internal

  return {
    guideUrl,
    isPreEvent,
  }
}
