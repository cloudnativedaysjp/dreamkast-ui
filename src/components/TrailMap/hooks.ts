import { useSelector } from 'react-redux'
import {
  settingsInitializedSelector,
  settingsSelector,
} from '../../store/settings'
import {
  setStampAddedByQRCode,
  stampAddedByQRCodeSelector,
  useStamps,
} from '../../store/appData'
import {
  usePostApiV1AppDataByProfileIdConferenceAndConferenceMutation,
  usePostApiV1ProfileByProfileIdPointMutation,
} from '../../generated/dreamkast-api.generated'
import {
  getAllStampCollected,
  getAllStampCompEventNum,
  getSessionEventNum,
  setAllStampCollected,
} from '../../util/sessionstorage/trailMap'
import { PrivateCtx } from '../../context/private'
import { useContext, useEffect, useState } from 'react'
import { stampLocation } from './internal/const'

export const useStampCompleteBonus = () => {
  const { stamps } = useStamps()
  const settings = useSelector(settingsSelector)
  const [postPointEvent] = usePostApiV1ProfileByProfileIdPointMutation()
  const envCtx = useContext(PrivateCtx)

  useEffect(() => {
    if (stamps.length < stampLocation.length) {
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
  }, [stamps.length])

  return
}

export const useAddStampIfSatisfied = () => {
  const { getPointEventId } = useContext(PrivateCtx)
  const settings = useSelector(settingsSelector)
  const initialized = useSelector(settingsInitializedSelector)
  const isStampAddedByQRCode = useSelector(stampAddedByQRCodeSelector)
  const { canGetNewStamp, slotIdToBeStamped } = useStamps()

  const [addedByQRCode, setAddedByQRCode] = useState<boolean>(false)
  const [addedNew, setAddedNew] = useState<boolean>(false)
  const [mutateAppData] =
    usePostApiV1AppDataByProfileIdConferenceAndConferenceMutation()
  const [postPointEvent] = usePostApiV1ProfileByProfileIdPointMutation()

  // get stamp by offline user via QR code
  useEffect(() => {
    if (isStampAddedByQRCode) {
      setAddedNew(true)
      setAddedByQRCode(true)
    }
    setStampAddedByQRCode(false)
  }, [isStampAddedByQRCode])

  // get stamp by online user
  useEffect(() => {
    if (!initialized) {
      return
    }
    if (!canGetNewStamp) {
      return
    }
    ;(async () => {
      if (!slotIdToBeStamped) {
        return
      }
      const eventNum = getSessionEventNum(slotIdToBeStamped)
      const pointEventId = getPointEventId(eventNum)
      try {
        await postPointEvent({
          profileId: `${settings.profile.id}`,
          profilePoint: {
            conference: settings.eventAbbr,
            pointEventId,
          },
        })
        await mutateAppData({
          profileId: `${settings.profile.id}`,
          conference: settings.eventAbbr,
          dkUiDataMutation: {
            action: 'stampedFromUI',
            payload: {
              slotId: slotIdToBeStamped,
            },
          },
        })
        setAddedNew(true)
      } catch (err) {
        console.error('stampFromUI Action', err)
      }
    })()
  }, [initialized, canGetNewStamp])

  return {
    addedNew,
    addedByQRCode,
  }
}
