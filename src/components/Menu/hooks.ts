import { useSelector } from 'react-redux'
import { settingsSelector } from '../../store/settings'

export const useMenuContents = () => {
  const settings = useSelector(settingsSelector)
  const guideUrl = (): string => {
    if (settings.profile.isAttendOffline) {
      return `https://pfem.notion.site/CNDW2025-2a121b0141e0811e8d0cc35668c47d8b`
    } else {
      return `https://pfem.notion.site/CNDW2025-2a121b0141e080bf83ece4c2b33f4227`
    }
  }
  const isPreEvent = settings.conferenceDay?.internal

  return {
    guideUrl,
    isPreEvent,
  }
}
