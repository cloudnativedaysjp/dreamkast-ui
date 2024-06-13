import { useSelector } from 'react-redux'
import { settingsSelector } from '../../store/settings'

export const useMenuContents = () => {
  const settings = useSelector(settingsSelector)
  const guideUrl = (): string => {
    if (settings.profile.isAttendOffline) {
      return `https://pfem.notion.site/CNDS2024-bede2ebca0de4b5a8b62c0f136fdc647`
    } else {
      return `https://pfem.notion.site/CNDS2024-ab12a060a67340629fdb007478fe2f84`
    }
  }
  const isPreEvent = settings.conferenceDay?.internal

  return {
    guideUrl,
    isPreEvent,
  }
}
