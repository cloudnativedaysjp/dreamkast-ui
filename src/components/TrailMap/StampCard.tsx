import React, { useEffect, useState } from 'react'
import * as Styled from './styled'
import { useSelector } from 'react-redux'
import { settingsSelector, stampSelector } from '../../store/settings'
import {
  usePostApiV1AppDataByProfileIdConferenceAndConferenceMutation,
  usePostApiV1ProfileByProfileIdPointMutation,
} from '../../generated/dreamkast-api.generated'
import { createHash } from 'crypto'

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
  const [postPointEvent] = usePostApiV1ProfileByProfileIdPointMutation()

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
    if (!stamp.canGetNewStamp) {
      return
    }
    ;(async () => {
      if (!stamp.slotIdToBeStamped) {
        return
      }
      const pointEventId = getPointEventId(
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

function getPointEventId(confName: string, slotId: number): string {
  const shasum = createHash('sha1')
  return shasum.update(`${confName}/10${slotId}`).digest('hex')
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
