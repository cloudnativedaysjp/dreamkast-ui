import React, { useEffect, useState } from 'react'
import * as Styled from './styled'
import { useSelector } from 'react-redux'
import { settingsSelector, stampSelector } from '../../store/settings'
import {
  usePostApiV1AppDataByProfileIdConferenceAndConferenceMutation,
  usePostApiV1ProfileByProfileIdPointMutation,
} from '../../generated/dreamkast-api.generated'
import {
  getPointEventIdBySlot,
  getQRCodeStampResult,
  clearQRCodeStampResult,
} from '../../util/stampCollecting'

type Props = {
  todo?: boolean
}

export const StampCard = (_: Props) => {
  const settings = useSelector(settingsSelector)
  const stamp = useSelector(stampSelector)
  const [alreadyAdded, setAlreadyAdded] = useState<boolean>(false)
  const [pinnedStamp, setPinnedStamp] = useState<typeof stamp | null>(null)
  const [stamped, setStamped] = useState<boolean>(false)
  const [mutateAppData] =
    usePostApiV1AppDataByProfileIdConferenceAndConferenceMutation()
  const [postPointEvent] = usePostApiV1ProfileByProfileIdPointMutation()

  useEffect(() => {
    if (!stamp.initialized || pinnedStamp !== null) {
      return
    }
    setPinnedStamp(stamp)
  }, [stamp, pinnedStamp])

  // get stamp by offline user via QR code
  useEffect(() => {
    const res = getQRCodeStampResult()
    if (!res) {
      return
    } else if (res === 'ok') {
      setStamped(true)
      setAlreadyAdded(true)
    } else {
      // TODO show error info
      console.error(`unexpected result: ${res}`)
    }
    clearQRCodeStampResult()
  }, [])

  // get stamp by online user
  useEffect(() => {
    if (!settings.initialized) {
      return
    }
    if (!stamp.canGetNewStamp) {
      return
    }
    ;(async () => {
      if (!stamp.slotIdToBeStamped) {
        return
      }
      const pointEventId = getPointEventIdBySlot(
        // TODO use random secret as salt
        settings.eventAbbr,
        stamp.slotIdToBeStamped,
      )
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
              slotId: stamp.slotIdToBeStamped,
            },
          },
        })
        setStamped(true)
      } catch (err) {
        console.error('stampFromUI Action', err)
      }
    })()
  }, [settings.initialized, stamp.canGetNewStamp])

  if (!pinnedStamp) {
    return <></>
  }

  const StampsNotYetAdded = stampLocation.map((loc, i) => (
    <Styled.StampFrame top={`${loc.top}%`} left={`${loc.left}%`}>
      {i < pinnedStamp.stamps.length ? (
        <Styled.Stamp
          src={`/cndt2022/ui/cndt2022_trademark.png`}
        ></Styled.Stamp>
      ) : (
        ''
      )}
      {i === pinnedStamp.stamps.length && stamped ? (
        <Styled.Stamp
          className={'showAnimation'}
          src={`/cndt2022/ui/cndt2022_trademark.png`}
        ></Styled.Stamp>
      ) : (
        ''
      )}
    </Styled.StampFrame>
  ))
  const StampsAlreadyAdded = stampLocation.map((loc, i) => (
    <Styled.StampFrame top={`${loc.top}%`} left={`${loc.left}%`}>
      {i < pinnedStamp.stamps.length - 1 ? (
        <Styled.Stamp
          src={`/cndt2022/ui/cndt2022_trademark.png`}
        ></Styled.Stamp>
      ) : (
        ''
      )}
      {i === pinnedStamp.stamps.length - 1 && stamped ? (
        <Styled.Stamp
          className={'showAnimation'}
          src={`/cndt2022/ui/cndt2022_trademark.png`}
        ></Styled.Stamp>
      ) : (
        ''
      )}
    </Styled.StampFrame>
  ))

  return (
    <>
      <Styled.Container>
        <Styled.TrailMapImg src={`/cndt2022/ui/wave.jpg`}></Styled.TrailMapImg>
        {alreadyAdded ? StampsAlreadyAdded : StampsNotYetAdded}
      </Styled.Container>
    </>
  )
}

const stampLocation = [
  {
    top: 25,
    left: 5,
  },
  {
    top: 25,
    left: 20,
  },
  {
    top: 25,
    left: 35,
  },
  {
    top: 25,
    left: 50,
  },
  {
    top: 25,
    left: 65,
  },
  {
    top: 25,
    left: 80,
  },

  {
    top: 60,
    left: 5,
  },
  {
    top: 60,
    left: 20,
  },
  {
    top: 60,
    left: 35,
  },
  {
    top: 60,
    left: 50,
  },
  {
    top: 60,
    left: 65,
  },
  {
    top: 60,
    left: 80,
  },
]
