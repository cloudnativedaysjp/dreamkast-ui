import { useSelector } from 'react-redux'
import { settingsSelector } from '../../store/settings'
import { Track } from '../../generated/dreamkast-api.generated'

export const useTracksWithLiveTalk = (tracks: Track[]) => {
  const { talks } = useSelector(settingsSelector)

  const data = tracks.map((tr) => {
    const talkId = tr.onAirTalk
      ? ((tr.onAirTalk as any)?.talk_id as string)
      : ''
    return {
      track: tr,
      talk: talks[talkId],
    }
  })

  return data
}
