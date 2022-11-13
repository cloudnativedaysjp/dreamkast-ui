import React, { useEffect, useState } from 'react'
import * as Styled from './styled'
import { useSelector } from 'react-redux'
import { settingsSelector, stampSelector } from '../../store/settings'
import { usePostApiV1AppDataByProfileIdConferenceAndConferenceMutation } from '../../generated/dreamkast-api.generated'

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

type Props = {
  todo?: boolean
}

export const StampCard = (_: Props) => {
  const settings = useSelector(settingsSelector)
  const stamp = useSelector(stampSelector)
  const [pinnedStamp, setPinnedStamp] = useState<typeof stamp | null>(null)
  const [stamped, setStamped] = useState<boolean>(false)
  const [mutateAppData] =
    usePostApiV1AppDataByProfileIdConferenceAndConferenceMutation()

  useEffect(() => {
    if (!stamp.initialized || pinnedStamp !== null) {
      return
    }
    setPinnedStamp(stamp)
  }, [stamp, pinnedStamp])

  useEffect(() => {
    if (!settings.initialized) {
      return
    }
    if (stamp.canGetNewStamp) {
      // TODO set point
      mutateAppData({
        profileId: `${settings.profile.id}`,
        conference: settings.eventAbbr,
        dkUiDataMutation: {
          action: 'stampedFromUI',
          payload: {
            slotId: stamp.slotIdToBeStamped,
          },
        },
      })
        .unwrap()
        .then(() => {
          setStamped(true)
        })
        .catch(() => {
          console.error('stampedFromUI action')
        })
    }
  }, [settings.initialized, stamp.canGetNewStamp])

  if (!pinnedStamp) {
    return <></>
  }

  return (
    <>
      <Styled.Container>
        <Styled.TrailMapImg src={`/cndt2022/ui/wave.jpg`}></Styled.TrailMapImg>
        {stampLocation.map((loc, i) => (
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
        ))}
      </Styled.Container>
    </>
  )
}
