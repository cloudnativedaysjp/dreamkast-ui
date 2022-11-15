import React, { useCallback, useContext, useState } from 'react'
import { useRouter } from 'next/router'
import { useInitSetup } from '../../../components/hooks/useInitSetup'
import { useEffect, useMemo } from 'react'
import { Layout } from '../../../components/Layout'
import {
  getSlotId,
  makeTrackResolveMap,
  setQRCodeStampResult,
  setTrailMapOpenNext,
  QRCodeRequestResult,
  getSessionEventNum,
} from '../../../util/trailMap'
import {
  useGetApiV1TalksByTalkIdQuery,
  useGetApiV1TracksQuery,
  usePostApiV1AppDataByProfileIdConferenceAndConferenceMutation,
  usePostApiV1ProfileByProfileIdPointMutation,
} from '../../../generated/dreamkast-api.generated'
import { settingsSelector } from '../../../store/settings'
import { useSelector } from 'react-redux'
import { NextPage } from 'next'
import { EnvCtx } from '../../../context/env'

type OnAirTalk = {
  talk_id: number
  [k: string]: any
}

const IndexPage: NextPage = () => {
  const router = useRouter()
  const envCtx = useContext(EnvCtx)
  const [talkId, setTalkId] = useState<number | null>(null)
  const [trackId, setTrackId] = useState<number | null>(null)
  const settings = useSelector(settingsSelector)
  const { eventAbbr, event } = useInitSetup()

  const [mutateAppData] =
    usePostApiV1AppDataByProfileIdConferenceAndConferenceMutation()
  const [postPointEvent] = usePostApiV1ProfileByProfileIdPointMutation()

  const eventMap = useMemo(() => {
    return makeTrackResolveMap(envCtx.getPointEventId)
  }, [eventAbbr])

  const tracksQuery = useGetApiV1TracksQuery(
    { eventAbbr },
    { skip: !eventAbbr },
  )
  const talksQuery = useGetApiV1TalksByTalkIdQuery(
    { talkId: `${talkId}` },
    { skip: talkId === null },
  )

  const goTrailMap = useCallback(
    (res: QRCodeRequestResult) => {
      setQRCodeStampResult(res)
      setTrailMapOpenNext()
      router.replace(`/${eventAbbr}/ui`, undefined, { shallow: true })
    },
    [eventAbbr],
  )

  useEffect(() => {
    if (!router.isReady) {
      return
    }
    const { key } = router.query
    if (!key) {
      goTrailMap('invalid')
      return
    }
    if (!tracksQuery.data) {
      return
    }
    const trackPos = eventMap[key as string]
    const track = tracksQuery.data[trackPos]

    if (!track?.onAirTalk) {
      goTrailMap('invalid')
      return
    }
    setTrackId(track.id)
    setTalkId((track.onAirTalk as OnAirTalk).talk_id)
  }, [router.isReady, tracksQuery.data, eventMap])

  // TODO add point using slotID/trackID/talkID
  useEffect(() => {
    if (!settings.initialized) {
      return
    }
    if (!talksQuery.data) {
      return
    }
    const slotId = getSlotId(talksQuery.data)

    ;(async () => {
      const eventNum = getSessionEventNum(slotId)
      const pointEventId = envCtx.getPointEventId(eventNum)
      try {
        await postPointEvent({
          profileId: `${settings.profile.id}`,
          profilePoint: {
            conference: settings.eventAbbr,
            pointEventId,
          },
        })
        const res = await mutateAppData({
          profileId: `${settings.profile.id}`,
          conference: settings.eventAbbr,
          dkUiDataMutation: {
            action: 'stampedFromQR',
            payload: {
              talkId,
              trackId,
              slotId,
            },
          },
        }).unwrap()
        console.warn(res)
        if (!res) {
          return
        }

        const { status } = res as { status: string; message: string }
        if (status === 'skipped') {
          goTrailMap('skipped')
          return
        }
        goTrailMap('ok')
      } catch (err) {
        console.error('stampFromUI Action', err)
        goTrailMap('error')
      }
    })()
  }, [talksQuery.data, settings.initialized])

  if (event) {
    return (
      <Layout title={event.name} event={event}>
        <div></div>
      </Layout>
    )
  }
  return <div></div>
}

export default IndexPage
