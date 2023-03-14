import { useSelector } from 'react-redux'
import {
  settingsInitializedSelector,
  settingsSelector,
} from '../../store/settings'
import { useStamps } from '../../store/appData'
import {
  usePostApiV1AppDataByProfileIdConferenceAndConferenceMutation,
  usePostApiV1ProfileByProfileIdPointMutation,
} from '../../generated/dreamkast-api.generated'
import {
  clearQRCodeStampResult,
  getAllStampCollected,
  getAllStampCompEventNum,
  getQRCodeStampResult,
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
  }, [])

  return
}

export const useAddStampIfSatisfied = () => {
  const { getPointEventId } = useContext(PrivateCtx)
  const settings = useSelector(settingsSelector)
  const initialized = useSelector(settingsInitializedSelector)
  const { canGetNewStamp, slotIdToBeStamped } = useStamps()

  const [addedByQRCode, setAddedByQRCode] = useState<boolean>(false)
  const [addedNew, setAddedNew] = useState<boolean>(false)
  const [mutateAppData] =
    usePostApiV1AppDataByProfileIdConferenceAndConferenceMutation()
  const [postPointEvent] = usePostApiV1ProfileByProfileIdPointMutation()

  // get stamp by offline user via QR code
  useEffect(() => {
    const res = getQRCodeStampResult()
    if (!res) {
      return
    } else if (res === 'ok') {
      setAddedNew(true)
      setAddedByQRCode(true)
    } else {
      // TODO show error info
      console.error(`unexpected result: ${res}`)
    }
    clearQRCodeStampResult()
  }, [])

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
