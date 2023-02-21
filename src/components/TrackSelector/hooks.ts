import { useSelector } from 'react-redux'
import { settingsSelector } from '../../store/settings'
import { Talk, Track } from '../../generated/dreamkast-api.generated'

export const useTracksWithLiveTalk = (): { track: Track; talk?: Talk }[] => {
  const { talks, tracks } = useSelector(settingsSelector)

  return tracks.map((tr) => {
    if (!tr.onAirTalk) {
      return {
        track: tr,
      }
    }
    const talkId = (tr.onAirTalk as { talk_id: string }).talk_id
    return {
      track: tr,
      talk: talks[talkId],
    }
  })
}
