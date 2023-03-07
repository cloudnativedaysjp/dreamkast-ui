import { useSelector } from 'react-redux'
import { settingsSelector } from '../../store/settings'
import { useStamps } from '../../store/appData'
import { usePostApiV1ProfileByProfileIdPointMutation } from '../../generated/dreamkast-api.generated'
import {
  getAllStampCollected,
  getAllStampCompEventNum,
  setAllStampCollected,
} from '../../util/sessionstorage/trailMap'
import { PrivateCtx } from '../../context/private'
import { useContext, useEffect } from 'react'

export const useStampCompleteBonus = () => {
  const { stamps } = useStamps()
  const settings = useSelector(settingsSelector)
  const [postPointEvent] = usePostApiV1ProfileByProfileIdPointMutation()
  const envCtx = useContext(PrivateCtx)

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
