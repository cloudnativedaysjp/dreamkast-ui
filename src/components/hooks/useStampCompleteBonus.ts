import { settingsSelector, stampSelector } from '../../store/settings'
import { useSelector } from 'react-redux'
import { usePostApiV1ProfileByProfileIdPointMutation } from '../../generated/dreamkast-api.generated'
import {
  getAllStampCollected,
  getAllStampCompEventNum,
  setAllStampCollected,
} from '../../util/sessionstorage/trailMap'
import { EnvCtx } from '../../context/env'
import { useContext, useEffect } from 'react'

export const useStampCompleteBonus = () => {
  const { stamps } = useSelector(stampSelector)
  const settings = useSelector(settingsSelector)
  const [postPointEvent] = usePostApiV1ProfileByProfileIdPointMutation()
  const envCtx = useContext(EnvCtx)

  useEffect(() => {
    if (stamps.length < 12) {
      return
    }
    if (getAllStampCollected()) {
      return
    }
    postPointEvent({
      profileId: `${settings.profile.id}`,
      profilePoint: {
        conference: settings.eventAbbr,
        pointEventId: envCtx.getPointEventId(getAllStampCompEventNum()),
      },
    })
      .unwrap()
      .then(() => {
        setAllStampCollected()
      })
      .catch((err) => {
        console.error(err)
      })
  }, [])

  return
}
