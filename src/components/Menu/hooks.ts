import { useSelector } from 'react-redux'
import { settingsSelector } from '../../store/settings'

export const useMenuContents = () => {
  const settings = useSelector(settingsSelector)
  const guideUrl = (): string => {
    if (settings.profile.isAttendOffline) {
      return `https://pfem.notion.site/CNDW2024-fe1c89735501496984e90793bf1ca697`
    } else {
      return `https://pfem.notion.site/CNDW2024-48b9f882622343ecbc7186834ba92612`
    }
  }
  const isPreEvent = settings.conferenceDay?.internal

  return {
    guideUrl,
    isPreEvent,
  }
}
